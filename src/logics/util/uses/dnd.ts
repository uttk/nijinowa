import { useRef } from "react";

interface DnDItemType {
  id: string;
}

interface DnDElementType {
  item: DnDItemType;
  node: HTMLElement;
  position: ClientRect | DOMRect;
}

interface DnDRefType {
  elements: DnDElementType[];

  pointerPosition: {
    x: number;
    y: number;
  };

  currentElement?: DnDElementType;
}

const updateRef = (dndCache: DnDRefType, element: DnDElementType) => {
  const index = dndCache.elements.findIndex(v => v.item.id === element.item.id);

  if (index !== -1) {
    dndCache.elements[index] = element;
  } else {
    dndCache.elements.push(element);
  }
};

const animation = (
  node: HTMLElement,
  before: ClientRect | DOMRect,
  after: ClientRect | DOMRect
) => {
  const x = before.left - after.left;
  const y = before.top - after.top;

  node.style.transition = "";
  node.style.transform = `translate(${x}px,${y}px)`;

  requestAnimationFrame(() => {
    node.style.transform = "";
    node.style.transition = "all 300ms";
  });
};

const itemSort = (dndCache: DnDRefType, e: MouseEvent): boolean => {
  const { elements, currentElement } = dndCache;

  if (currentElement) {
    const currentIndex = elements.findIndex(
      v => v.item.id === currentElement.item.id
    );
    const clientX = e.clientX;
    const clientY = e.clientY;

    for (const i in elements) {
      if (i || +i === 0) {
        const rect = elements[i].node.getBoundingClientRect();

        if (elements[i].item.id !== currentElement.item.id) {
          if (
            clientY < rect.bottom &&
            clientY > rect.top &&
            clientX < rect.right &&
            clientX > rect.left
          ) {
            elements.splice(currentIndex, 1);
            elements.splice(+i, 0, currentElement);

            currentElement.position = currentElement.node.getBoundingClientRect();

            dndCache.pointerPosition.x = clientX;
            dndCache.pointerPosition.y = clientY;

            return true;
          }
        }
      }
    }
  }

  return false;
};

export const useDnD = <ItemType extends DnDItemType>(
  items: ItemType[],
  updateCallback?: (items: ItemType[]) => void
) => {
  const ref = useRef<DnDRefType>({
    elements: [],
    pointerPosition: { x: 0, y: 0 }
  }).current;

  if (ref.elements.length !== items.length) {
    ref.elements = [];
  }

  return {
    items,

    newProps(id: string) {
      let done = true;

      const onMove = (e: MouseEvent) => {
        if (ref.currentElement) {
          const x = e.clientX - ref.pointerPosition.x;
          const y = e.clientY - ref.pointerPosition.y;

          const node = ref.currentElement.node;
          node.style.transform = `translate(${x}px,${y}px)`;
          node.style.transition = "";
          node.style.zIndex = "100";
          node.style.cursor = "grabbing";

          if (done) {
            done = false;

            if (itemSort(ref, e) && updateCallback) {
              const list = ref.elements.map(v => v.item);
              updateCallback(list as ItemType[]);
            }

            setTimeout(() => {
              done = true;
            }, 300);
          }
        }
      };

      const onMouseUp = () => {
        const ele = ref.elements.find(v => v.item.id === id);

        if (ele) {
          const nodeStyle = ele.node.style;

          nodeStyle.transform = "";
          nodeStyle.zIndex = "";
          nodeStyle.cursor = "";

          delete ref.currentElement;
        }

        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      return {
        ref: (dom: HTMLElement | null) => {
          const item = items.find(v => v.id === id);

          if (dom && item) {
            dom.style.transform = "";

            const currentEle = ref.currentElement;
            const position = dom.getBoundingClientRect();

            if (currentEle) {
              if (item.id === currentEle.item.id) {
                const { left, top } = currentEle.position;
                const x = left - position.left;
                const y = top - position.top;

                dom.style.transform = `translate(${x}px,${y}px)`;

                ref.pointerPosition.x -= x;
                ref.pointerPosition.y -= y;
              } else {
                const ele = ref.elements.find(v => v.item.id === id);

                if (ele) {
                  animation(dom, ele.position, position);
                }
              }
            }

            updateRef(ref, { item, node: dom, position });
          }
        },

        onMouseDown(e: React.MouseEvent<HTMLElement>) {
          ref.pointerPosition.x = e.clientX;
          ref.pointerPosition.y = e.clientY;

          ref.currentElement = ref.elements.find(v => v.item.id === id);

          if (ref.currentElement) {
            e.currentTarget.style.cursor = "grabbing";
          }

          ref.elements.forEach(ele => {
            ele.position = ele.node.getBoundingClientRect();
          });

          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onMouseUp);
        }
      };
    }
  };
};
