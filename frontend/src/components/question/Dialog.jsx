import { forwardRef } from "react";

const Dialog = forwardRef(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
      >
        <div>
          {children}
        </div>
      </dialog>
    );
  }
);

export default Dialog;
