"use client";

import "@/demos/moindi/styles/modal.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./Button";

export interface ModalOptions {
  title: string;
  message?: string;
  // replaces the message, like the angular customTemplate
  content?: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  // can be async: the buttons show a loading state until it settles, and a throw keeps the modal open
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface DemoModal {
  // resolves true on confirm, false on cancel / escape / backdrop click
  openModal: (options: ModalOptions) => Promise<boolean>;
  closeModal: () => void;
}

const DemoModalContext = createContext<DemoModal | null>(null);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // starts the fade-out; the modal unmounts once the backdrop's animation ends
  const close = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setIsFading(true);
  }, []);

  const openModal = useCallback((options: ModalOptions) => {
    // opening over another modal cancels the first one
    resolveRef.current?.(false);
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setIsFading(false);
    setIsLoading(false);
    setModal(options);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    modal?.onCancel?.();
    close(false);
  }, [close, isLoading, modal]);

  const handleConfirm = async () => {
    if (!modal?.onConfirm) return close(true);
    setIsLoading(true);
    try {
      await modal.onConfirm();
      close(true);
    } catch {
      setIsLoading(false);
    }
  };

  const handleAnimationEnd = (event: React.AnimationEvent) => {
    if (!isFading || event.target !== event.currentTarget) return;
    setModal(null);
    setIsFading(false);
    previousFocusRef.current?.focus();
  };

  // focus the modal and lock page scroll while it's open
  useEffect(() => {
    if (!modal) return;
    containerRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  const value = useMemo(
    () => ({ openModal, closeModal: () => close(false) }),
    [openModal, close],
  );

  const {
    title,
    message,
    content,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    showConfirmButton = true,
    showCancelButton = true,
  } = modal ?? {};

  return (
    <DemoModalContext.Provider value={value}>
      {children}

      {modal && (
        <div
          className={`modal-backdrop ${isFading ? "modal-fade-out" : "modal-fade-in"}`}
          onClick={handleCancel}
          onKeyDown={(event) => event.key === "Escape" && handleCancel()}
          onAnimationEnd={handleAnimationEnd}
        >
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`modal-container flex flex-col gap-(--standard-space) ${isFading ? "modal-slide-out" : "modal-slide-in"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header m-0">
              <h4
                id={titleId}
                className="modal-title space-mono mb-(--standard-space)"
              >
                {title}
              </h4>
            </div>
            <div className="modal-content text-justify text-pretty">
              {content ?? <p className="m-0">{message}</p>}
            </div>
            <hr className="border-(--card-border-color)" />
            <div className="modal-actions-container flex w-full flex-col-reverse justify-end gap-2 md:flex-row md:gap-(--standard-space)">
              {showCancelButton && (
                <Button
                  variant="outline"
                  color="default"
                  disabled={isLoading}
                  onClick={handleCancel}
                >
                  {cancelButtonText}
                </Button>
              )}
              {showConfirmButton && (
                <Button
                  variant="fill"
                  color="primary"
                  disabled={isLoading}
                  onClick={handleConfirm}
                >
                  {isLoading ? "Loading..." : confirmButtonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const modal = useContext(DemoModalContext);
  if (!modal) {
    throw new Error("useDemoModal must be used inside DemoModalProvider");
  }
  return modal;
}
