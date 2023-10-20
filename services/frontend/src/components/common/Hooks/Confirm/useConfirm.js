import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useConfirm = () => {
  const { confirm, setConfirm } = useMainContext();
  
  const isConfirmed = (prompt,option={}) => {
    const promise = new Promise((resolve, reject) => {
      setConfirm({
        prompt,
        isOpen: true,
        proceed: resolve,
        cancel: reject,
        option: {
            promptHeader: option.promptHeader,
            proceedText: option.proceedText,
            cancelText: option.cancelText
        }
      });
    });
    return promise.then(
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return true;
      },
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return false;
      }
    );
  };
  return {
    ...confirm,
    isConfirmed
  };
};

export default useConfirm;