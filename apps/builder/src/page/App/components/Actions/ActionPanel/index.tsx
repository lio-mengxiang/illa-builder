import { FC, ReactNode, useCallback, useMemo, useRef, useState } from "react"
import {
  actionContentStyle,
  actionPanelStyle,
} from "@/page/App/components/Actions/ActionPanel/style"
import { useSelector } from "react-redux"
import { getSelectedAction } from "@/redux/config/configSelector"
import { ActionTitleBar } from "@/page/App/components/Actions/ActionPanel/ActionTitleBar"
import { MysqlLikePanel } from "./MysqlLikePanel"
import { RestApiPanel } from "@/page/App/components/Actions/ActionPanel/RestApiPanel"
import { TransformerPanel } from "@/page/App/components/Actions/ActionPanel/TransformerPanel"
import { ActionItem } from "@/redux/currentApp/action/actionState"
import { MysqlLikeAction } from "@/redux/currentApp/action/mysqlLikeAction"
import {
  BodyContent,
  RestApiAction,
} from "@/redux/currentApp/action/restapiAction"
import { TransformerAction } from "@/redux/currentApp/action/transformerAction"
import { onCopyActionItem, onDeleteActionItem } from "../api"
import { ActionResult } from "@/page/App/components/Actions/ActionPanel/ActionResult"
import { ActionResultType } from "@/page/App/components/Actions/ActionPanel/ActionResult/interface"
import { RedisAction } from "@/redux/currentApp/action/redisAction"
import { RedisPanel } from "@/page/App/components/Actions/ActionPanel/RedisPanel"
import { MongoDbPanel } from "@/page/App/components/Actions/ActionPanel/MongoDbPanel"
import { MongoDbAction } from "@/redux/currentApp/action/mongoDbAction"

export interface ActionPanelProps {
  maxHeight?: number
}

export const ActionPanel: FC<ActionPanelProps> = (props) => {
  const { maxHeight } = props
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectedAction = useSelector(getSelectedAction)
  const [actionResult, setActionResult] = useState<ActionResultType>()

  const run = useCallback((result, error) => {
    setActionResult({ result, error })
  }, [])

  const actionPanel: ReactNode | null = useMemo(() => {
    switch (selectedAction?.actionType) {
      case "mysql":
      case "tidb":
      case "mariadb":
      case "postgresql":
        return (
          <MysqlLikePanel
            action={selectedAction as ActionItem<MysqlLikeAction>}
          />
        )
      case "restapi":
        return (
          <RestApiPanel
            action={selectedAction as ActionItem<RestApiAction<BodyContent>>}
          />
        )
      case "transformer":
        return (
          <TransformerPanel
            action={selectedAction as ActionItem<TransformerAction>}
          />
        )
      case "redis":
        return <RedisPanel action={selectedAction as ActionItem<RedisAction>} />
      case "mongodb":
        return (
          <MongoDbPanel action={selectedAction as ActionItem<MongoDbAction>} />
        )
      default:
        return null
    }
  }, [selectedAction])

  // null selected
  if (selectedAction === null || selectedAction === undefined) {
    return null
  }

  return (
    <div css={actionPanelStyle} ref={panelRef}>
      <ActionTitleBar
        action={selectedAction}
        onCopy={onCopyActionItem}
        onDelete={onDeleteActionItem}
        onActionRun={run}
      />
      <div ref={contentRef} css={actionContentStyle}>
        {actionPanel}
      </div>
      <ActionResult
        result={actionResult}
        onClose={() => {
          setActionResult(undefined)
          if (contentRef.current) {
            contentRef.current.style.paddingBottom = "48px"
          }
        }}
        maxHeight={maxHeight}
        placeholderRef={contentRef}
      />
    </div>
  )
}

ActionPanel.displayName = "ActionPanel"
