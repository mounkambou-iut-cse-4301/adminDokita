import React, { useState, useEffect, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  position?: "center" | "top" | "bottom" | "left" | "right";
  height?: "auto" | "screen" | number;
  closeButton?: {
    label?: string;
    onClick?: () => void;
  };
}

const TMModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  position = "center",
  height = 80,
  closeButton,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
    closeButton?.onClick?.();
    onClose();
  };

  const getModalSizeClass = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "lg":
        return "max-w-4xl";
      case "full":
        return "max-w-[60vw] w-[80vw]";
      default:
        return "max-w-2xl";
    }
  };

  const getModalPositionClass = () => {
    switch (position) {
      case "top":
        return "items-start";
      case "bottom":
        return "items-end";
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "items-center justify-center";
    }
  };

  const getModalHeightClass = () => {
    if (typeof height === "number") {
      return `h-[${height}vh]`;
    } else if (height === "screen") {
      return "h-screen";
    } else {
      return "h-auto";
    }
  };

  return (
    <>
      {showModal && (
        <div
          className={`fixed z-10 overflow-hidden rounded-md overflow-y-auto ${
            size === "full" ? "inset-2 mt-4" : "inset-6 mt-20"
          }`}
        >
          <div
            className={`flex ${getModalPositionClass()}   mr-4 text-center`}
            onClick={!closeButton ? handleClose : undefined}>
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"></div>

            <div
              className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-all ${getModalSizeClass()} ${getModalHeightClass()}`}
              onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-5 sm:p-6 relative">
                {title && (
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {title}
                      </h3>
                    </div>
                  </div>
                )}
                <div className="mt-5">{children}</div>
                {closeButton && (
                  <div className="absolute top-4 right-4">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 focus:outline-none"
                      onClick={handleCloseButtonClick}>
                      {closeButton.label || "Fermer"}
                    </button>
                  </div>
                )}
              </div>
              {footer && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TMModal;
