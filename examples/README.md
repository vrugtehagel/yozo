# Yozo examples

Here, you can find a handful of examples using Yozo to write basic UI elements. In order to make these useful as the first components one may look at, they're all fairly small (<100 lines) Note that while these work as-is, they may lack certain accessability features. While they are a solid baseline for a component, you should probably write your components based on your own specific needs.

## `yozo-dropdown`

 - [x] Form control

| attribute | property | function |
------------|----------|----------|
| `value` | `value` | The current value of the input. |
| `placeholder` | `placeholder` | The text shown if no value is selected. |
| `open` | `open` | Whether or not the dropdown is currently opened. |

Example usage:
```html
<yozo-dropdown name=form-drink placeholder="Pick your drink">
    <option value=tea>English tea</option>
    <option value=coffee>Black coffee</option>
    <option value=cocoa>Chocolate milk</option>
</yozo-dropdown>
```

## `yozo-switch`

 - [x] Form control

| attribute | property | function |
------------|----------|----------|
| `value` | `value`, `checked` | The current value of the input. |

Example usage:
```html
<yozo-switch checked></yozo-switch>
```

## `yozo-collapsible`

| attribute | property | function |
------------|----------|----------|
| `open` | `open` | Whether or not the collapsible is currently opened. |

Example usage:
```html
<yozo-collapsible>
    <header slot=header>Why kittens are cute</header>
    <p>
       They're so darn soft and their eyes look so adorable and the
       pillows on their paws and gosh! They're just cute. 
    </p>
</yozo-collapsible>
```

## `yozo-slider`

 - [x] Form control

| attribute | property | function |
------------|----------|----------|
| `value` | `value` | The current value of the input. |
| `start` | `start` | The minimum value the input can take. |
| `end` | `end` | The maximum value the input can take. |
| `step` | `step` | Interval size, starting from `start`. |

Example usage:
```html
<yozo-slider start=5 end=10 step=.5 value=7.5></yozo-slider>
```
