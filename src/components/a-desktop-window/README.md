# &lt;some-tiles&gt;
A web component that functions kind of like a window on a desktop.

## Attributes

### `draggable`
Informs that this window is supposed to be draggable.

Default value: undefined.

### `dragging`
The window is in dragging-mode.

Default value: undefined.

### `app-name`
Giving the attribute an value sets the name that is then displayed in the top bar of the window.

Default value: undefined.

## Events 
|  Event Name  |           Fired When        |
|--------------|-----------------------------|
|`closeWindow` | The close-button is pressed |

## Styling with CSS
Changes on the host can be made for example font, border-style, shadow and default left and top positioning.

## Example
Add a slot named "an-application" to fill the window with an app or element. To add name in the window's top bar, give the window-element 

(```html
  <a-desktop-window appName="Memory Game">
    <a-memory-game slot="an-application"></a-memory-game>
  </a-desktop-window>
```)