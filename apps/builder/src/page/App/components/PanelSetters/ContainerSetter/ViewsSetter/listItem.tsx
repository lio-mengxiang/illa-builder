import { FC, useCallback, useContext, useRef, useState } from "react"
import {
  actionWrapperStyle,
  copyIconStyle,
  iconStyle,
  listItemTriggerWrapperStyle,
} from "@/page/App/components/PanelSetters/ContainerSetter/ViewsSetter/style"
import { ViewItemShape } from "@/page/App/components/PanelSetters/ContainerSetter/ViewsSetter/interface"
import { CopyIcon, ReduceIcon } from "@illa-design/icon"
import { DragIconAndLabel } from "@/page/App/components/PanelSetters/ContainerSetter/ViewsSetter/dragIconAndLabel"
import { ViewListSetterContext } from "@/page/App/components/PanelSetters/ContainerSetter/ViewsSetter/context/viewsListContext"
import { BaseModal } from "@/page/App/components/PanelSetters/PublicComponent/Modal"
import { Trigger } from "@illa-design/trigger"
import { useTranslation } from "react-i18next"
import { useDrag, useDrop, XYCoord } from "react-dnd"
import { DragItem } from "@/page/App/components/PanelSetters/OptionListSetter/interface"
import { Identifier } from "dnd-core"
import { SelectedProvider } from "@/page/App/components/InspectPanel/context/selectedContext"
import { get } from "lodash"

interface ListItemProps {
  value: ViewItemShape
  index: number
}

export const ListItem: FC<ListItemProps> = (props) => {
  const { value, index } = props
  const [modalVisible, setModalVisible] = useState(false)
  const {
    handleDeleteOptionItem,
    handleCopyOptionItem,
    attrPath,
    widgetDisplayName,
    childrenSetter,
    handleMoveOptionItem,
    handleUpdateMultiAttrDSL,
    handleUpdateOtherMultiAttrDSL,
    linkWidgetDisplayName,
  } = useContext(ViewListSetterContext)
  const { t } = useTranslation()

  const dragRef = useRef<HTMLSpanElement>(null)

  const handleCloseModal = useCallback(() => {
    setModalVisible(false)
  }, [])

  const [, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "VIEW_ITEM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!dragRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = dragRef.current?.getBoundingClientRect()
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
      handleMoveOptionItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "VIEW_ITEM",
    item: () => {
      return { index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(dragRef))
  const opacity = isDragging ? 0 : 1

  const handleUpdateDsl = useCallback(
    (attrName: string, value: any) => {
      handleUpdateMultiAttrDSL?.({
        [attrName]: value,
      })
      if (linkWidgetDisplayName) {
        handleUpdateOtherMultiAttrDSL?.(linkWidgetDisplayName, {
          [attrName]: value,
        })
      }
    },
    [
      handleUpdateMultiAttrDSL,
      handleUpdateOtherMultiAttrDSL,
      linkWidgetDisplayName,
    ],
  )

  return (
    <Trigger
      withoutPadding
      colorScheme="white"
      popupVisible={modalVisible}
      content={
        <SelectedProvider
          widgetOrAction="WIDGET"
          handleUpdateDsl={handleUpdateDsl}
          handleUpdateOtherMultiAttrDSL={handleUpdateOtherMultiAttrDSL}
        >
          <BaseModal
            title={t("editor.inspect.setter_content.option_list.model_title")}
            handleCloseModal={handleCloseModal}
            attrPath={`${attrPath}.${index}`}
            widgetDisplayName={widgetDisplayName}
            childrenSetter={childrenSetter}
          />
        </SelectedProvider>
      }
      trigger="click"
      showArrow={false}
      position="left"
      clickOutsideToClose
      onVisibleChange={(visible) => {
        setModalVisible(visible)
      }}
    >
      <span css={listItemTriggerWrapperStyle} style={{ opacity }} ref={dragRef}>
        <DragIconAndLabel index={index} />
        <span css={actionWrapperStyle}>
          <CopyIcon
            css={copyIconStyle}
            id="copyIcon"
            onClick={(e) => {
              e.stopPropagation()
              handleCopyOptionItem(index)
            }}
          />
          <ReduceIcon
            css={iconStyle}
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteOptionItem(index)
            }}
          />
        </span>
      </span>
    </Trigger>
  )
}
