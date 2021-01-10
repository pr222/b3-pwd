# &lt;some-tiles&gt;
A web component that functions kind of like a window on a desktop.

## Attributes

### 

Default value: undefined.

## Events 
|  Event Name  |       Fired When        |
|--------------|-------------------------|
|              |                         |

## Styling with CSS


## Example
Add slots to fill window with the custom app or element and a name for the upper bar.

(```html
  <a-desktop-window>
    <slot>Memory Game</slot>
    <a-memory-game slot="an-application"></a-memory-game>
  </a-desktop-window>
```)