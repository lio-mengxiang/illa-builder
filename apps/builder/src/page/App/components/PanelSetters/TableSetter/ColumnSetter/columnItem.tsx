import { FC, useContext, useRef } from "react"
import { DragItem, ColumnItemProps } from "./interface"
import { useDrag, useDrop, XYCoord } from "react-dnd"
import { Identifier } from "dnd-core"
import { optionListItemStyle } from "./style"
import { DragIconAndLabel } from "./dragIconAndLabel"
import { ColumnListSetterContext } from "./context/columnListContext"

export const ColumnItem: FC<ColumnItemProps> = (props) => {
  const { accessorKey, header, value, visible, index } = props

  const { handleMoveColumnItem } = useContext(ColumnListSetterContext)
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "OPTION_ITEM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      handleMoveColumnItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "OPTION_ITEM",
    item: () => {
      return { accessorKey, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))
  const opacity = isDragging ? 0 : 1

  return (
    <div ref={ref} style={{ opacity }}>
      <div css={optionListItemStyle}>
        <DragIconAndLabel index={index} label={header} visible={visible} />
      </div>
    </div>
  )
}
