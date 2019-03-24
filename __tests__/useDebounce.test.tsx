import * as React from 'react';
import { render } from 'react-testing-library';
import { useDebounce, OnChangeFnT, DebounceSettingsT } from '../lib/useDebounce';

interface UsesHooksPropsT<V> {
  value: V;
  onChange: OnChangeFnT<V>;
  delay: number;
  settings: DebounceSettingsT;
}
function UsesHook<V>(props: UsesHooksPropsT<V>) {
  useDebounce(props.value, props.onChange, props.delay, props.settings);
  return null;
}

const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

describe('useDebounce', () => {
  it('debounces keystrokes', async () => {
    const props: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: {},
    };

    const onChangeSpy = spyOn(props, 'onChange');
    const component = render(<UsesHook {...props} />);

    const input = 'testing';
    for (let i = 0; i < input.length; i++) {
      const value = input.slice(0, i + 1);
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(props.delay);
    expect(onChangeSpy).toBeCalledTimes(1);
    expect(onChangeSpy).toBeCalledWith(input);

    const input2 = input + ' useDebounce hook';
    for (let i = 0; i < input2.length; i++) {
      const value = input2.slice(0, i + 1);
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(props.delay);
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).lastCalledWith(input2);
  });

  it('does not debounce if pace = delay', async () => {
    const props: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 10,
      settings: {},
    };

    const onChangeSpy = spyOn(props, 'onChange');
    const component = render(<UsesHook {...props} />);

    const input = 'testing';
    for (let i = 0; i < input.length; i++) {
      const value = input.slice(0, i + 1);
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(props.delay);
    }

    await wait(props.delay);
    expect(onChangeSpy).toBeCalledTimes(input.length);
    expect(onChangeSpy).lastCalledWith(input);
  });

  it('respects leading & trailing option', async () => {
    const props: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: { leading: true, trailing: true },
    };

    const onChangeSpy = spyOn(props, 'onChange');
    const component = render(<UsesHook {...props} />);

    const input = 'testing';
    for (let i = 0; i < input.length; i++) {
      const value = input.slice(0, i + 1);
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(props.delay);
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).nthCalledWith(1, '');
    expect(onChangeSpy).nthCalledWith(2, input);
  });

  it('respects leading (& !trailing) option', async () => {
    const props: UsesHooksPropsT<string> = {
      value: 'testing',
      onChange: () => undefined,
      delay: 100,
      settings: { leading: true, trailing: false },
    };

    const onChangeSpy = spyOn(props, 'onChange');
    const component = render(<UsesHook {...props} />);

    // NOTE: this one erases 1 character per iteration
    for (let i = 1; i <= props.value.length; i++) {
      const value = props.value.slice(0, -i);
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(props.delay);
    expect(onChangeSpy).toBeCalledTimes(1);
    expect(onChangeSpy).nthCalledWith(1, props.value);
  });

  // This one is tough to test because the timeouts are not accurate
  // it('respects maxWait option', async () => {});

  it('cancels and calls onChange if the function changes', async () => {
    const initialProps: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: {},
    };

    const onChangeSpy = spyOn(initialProps, 'onChange');
    const component = render(<UsesHook {...initialProps} />);

    const newProps = { ...initialProps, onChange: () => undefined };
    const onChangeSpy2 = spyOn(newProps, 'onChange');

    component.rerender(<UsesHook {...newProps} />);

    await wait(initialProps.delay);
    expect(onChangeSpy).toBeCalledTimes(0);
    expect(onChangeSpy2).toBeCalledTimes(1);
    expect(onChangeSpy2).toBeCalledWith(initialProps.value);
  });

  it('calls onChange if "delay" changes', async () => {
    const initialProps: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: { leading: true, trailing: false },
    };

    const onChangeSpy = spyOn(initialProps, 'onChange');
    const component = render(<UsesHook {...initialProps} />);

    const newProps = { ...initialProps, delay: initialProps.delay + 1 };
    component.rerender(<UsesHook {...newProps} />);

    await wait(newProps.delay);
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).nthCalledWith(1, initialProps.value);
    expect(onChangeSpy).nthCalledWith(2, initialProps.value);
  });

  it('calls onChange if "options" change', async () => {
    const initialProps: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: { leading: true, trailing: false },
    };

    const onChangeSpy = spyOn(initialProps, 'onChange');
    const component = render(<UsesHook {...initialProps} />);

    const newProps = {
      ...initialProps,
      settings: { leading: false, trailing: true },
    };
    component.rerender(<UsesHook {...newProps} />);

    await wait(initialProps.delay);
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).nthCalledWith(1, initialProps.value);
    expect(onChangeSpy).nthCalledWith(2, initialProps.value);
  });

  it('cancels debounce when "onChange" changes mid-input', async () => {
    const initialProps: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: { leading: false, trailing: true },
    };

    const onChangeSpy = spyOn(initialProps, 'onChange');
    const component = render(<UsesHook {...initialProps} />);

    const newProps = { ...initialProps, onChange: () => undefined };
    const onChangeSpy2 = spyOn(newProps, 'onChange');

    const input = 'testing';
    for (let i = 1; i <= input.length + 1; i++) {
      const value = input.slice(0, i);
      const props = i > input.length / 2 ? newProps : initialProps;
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(initialProps.delay);
    expect(onChangeSpy).toBeCalledTimes(0);
    expect(onChangeSpy2).toBeCalledTimes(1);
    expect(onChangeSpy2).toBeCalledWith(input);
  });

  // it('handles case where delay change mid-input' async () => {})

  it('cancels and respects new config when "options" change mid-input', async () => {
    const initialProps: UsesHooksPropsT<string> = {
      value: '',
      onChange: () => undefined,
      delay: 100,
      settings: {},
    };

    const onChangeSpy = spyOn(initialProps, 'onChange');
    const component = render(<UsesHook {...initialProps} />);

    const newProps = {
      ...initialProps,
      settings: { leading: true, trailing: true },
    };

    const input = 'testing';
    for (let i = 1; i <= input.length + 1; i++) {
      const value = input.slice(0, i);
      const props = i > input.length / 2 ? newProps : initialProps;
      component.rerender(<UsesHook {...props} value={value} />);
      await wait(10);
    }

    await wait(newProps.delay);
    expect(onChangeSpy).toBeCalledTimes(2);

    // because leading changes to true we expect this to be called
    expect(onChangeSpy).nthCalledWith(1, input.slice(0, Math.ceil(input.length / 2)));
    expect(onChangeSpy).nthCalledWith(2, input);
  });
});
