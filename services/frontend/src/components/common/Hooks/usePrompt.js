import { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import useConfirm from "components/common/Hooks/Confirm/useConfirm";

function useConfirmExit(confirmExit, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      const result = confirmExit();
      if (result !== false) {
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, confirmExit, when]);
}

export function usePrompt(when = true, message = null) {
  if(!message) message = "Are you sure you want to leave this page without saving?";
  // const { isConfirmed } = useConfirm();
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return message;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  const confirmExit = useCallback(() => { // `async` is letting user bypass the prompt, in other word click gets executed before the prompt returns a value
    // let confirm = await isConfirmed(message); // need to find a way to block next action until user clicks yes or no (similar to window.confirm)
    const confirm = window.confirm(message); // uncomment this line and comment the line above to use custom window.confirm
    return confirm;
  }, [message]);
  useConfirmExit(confirmExit, when);
}
