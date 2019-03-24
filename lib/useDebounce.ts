import * as React from 'react';
import debounce from 'lodash/debounce';

export interface DebounceSettingsT {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
}

export type OnChangeFnT<V> = (updatedValue: V) => void;

export default function useDebounce<V>(
  value: V,
  onChange: OnChangeFnT<V>,
  delay: number,
  options: DebounceSettingsT | undefined = {},
) {
  const ref = React.useRef(debounce(onChange, delay, options));

  React.useEffect(() => {
    ref.current = debounce(onChange, delay, options);
    return () => {
      ref.current.cancel();
    };
  }, [onChange, delay, options.leading, options.trailing, options.maxWait]);

  React.useEffect(() => {
    ref.current(value);
  }, [value, ref.current]);
}
