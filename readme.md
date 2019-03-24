# re-use-debounce ![npm](https://img.shields.io/npm/v/re-use-debounce.svg) [![Build Status](https://travis-ci.org/sseppola/re-use-debounce.svg?branch=master)](https://travis-ci.org/sseppola/re-use-debounce) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/re-use-debounce.svg) ![NPM](https://img.shields.io/npm/l/re-use-debounce.svg)

> Reuse lodash debounce as React hook


## Install

```
$ npm install re-use-debounce
```

Note: This libaray expects that you already depend on lodash 4.


## Usage

```js
import React from 'react';
import useDebounce from 're-use-debounce';

function MyComponent(props) {
  const [value, setValue] = React.useState('');

  const [debouncedValue, setDebouncedValue] = React.useState('');
  useDebounce(value, setDebouncedValue, 300);

  React.useEffect(() => {
    console.log(`debouncedValue: ${debouncedValue}`);
  }, [debouncedValue])

  return (
    <input value={value} onChange={event => setValue(event.target.value)} />
  );
}
```


## API

### useDebounce(input, onChange, delay, [options])

#### input

Type: `any`

The value that is being debounced

#### onChange

Type: `function`

The function to debounce

#### delay

Type: `number`

The number of milliseconds to debounce

#### options

Type: `Object`

##### leading

Type: `boolean`<br>
Default: `false`

Specify invoking on the leading edge of the timeout.

##### trailing

Type: `boolean`<br>
Default: `true`

Specify invoking on the trailing edge of the timeout.

##### maxWait

Type: `number`<br>
Default: `undefined`

The maximum time `onChange` is allowed to be delayed before it's invoked.


## License

MIT © [Sindre Seppola](https://github.com/sseppola)
