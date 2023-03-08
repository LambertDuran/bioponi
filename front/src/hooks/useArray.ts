import { useState } from "react";

export default function useArray<T>(initialValue: T[]) {
  const [array, setArray] = useState(initialValue);

  const push = (element: T) => {
    setArray((a) => [...a, element]);
  };

  const filter = (callback: (element: T) => boolean) => {
    setArray((a) => a.filter(callback));
  };

  const update = (index: number, element: T) => {
    setArray((a) => [
      ...a.slice(0, index),
      element,
      ...a.slice(index + 1, a.length - 1),
    ]);
  };

  const remove = (index: number) => {
    setArray((a) => [
      ...a.slice(0, index),
      ...a.slice(index + 1, a.length - 1),
    ]);
  };

  return {
    array,
    setArray,
    push,
    filter,
    update,
    remove,
  };
}
