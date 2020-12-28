# &lt;some-tiles&gt;
A web component showing tiles with cards that can be faced up or faced down cards.

## Attributes

### `disabled`
When disabled card is displayed with faded opacity and do not respond to keypresses.

Default value: undefined.

### `hidden`
Hides the card, leaving only the border of the tile visible. There is no card left to interact with.

Default value: undefined.

### `faceup`
When defined it displays the front part of the card faced up for the viewer.

Default value: undefined.

## Events 
|  Event Name  |       Fired When        |
|--------------|-------------------------|
|`flippingCard`| When a card is flipped. |

## Styling with CSS

Size and default border styles are changed on the element itself (host).

The backside of the card is styleable with the part `backSide`.

The frontside of the card is styleable with the part `frontSide` and a img-element can be added to one available slot.

## Example
(```html
   <some-tiles><img src="/images/img.png" alt="image"></some-tiles>
```)