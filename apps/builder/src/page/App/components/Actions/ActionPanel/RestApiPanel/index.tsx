import { FC } from "react"
import { ResourceChoose } from "@/page/App/components/Actions/ActionPanel/ResourceChoose"
import {
  restapiItemInputStyle,
  restapiItemLabelStyle,
  restapiItemStyle,
  restapiPanelContainerStyle,
  topDivider,
} from "./style"
import { useTranslation } from "react-i18next"
import { Select } from "@illa-design/select"
import { useDispatch } from "react-redux"
import { configActions } from "@/redux/config/configSlice"
import { CodeEditor } from "@/components/CodeEditor"
import { VALIDATION_TYPES } from "@/utils/validationFactory"
import { Input } from "@illa-design/input"
import { TransformerComponent } from "@/page/App/components/Actions/ActionPanel/TransformerComponent"
import { RestApiPanelProps } from "@/page/App/components/Actions/ActionPanel/interface"
import store from "@/store"
import {
  Params,
  RestApiAuth,
  RestApiResource,
} from "@/redux/resource/restapiResource"
import { RecordEditor } from "@/page/App/components/Actions/ActionPanel/RecordEditor"
import { BodyEditor } from "@/page/App/components/Actions/ActionPanel/RestApiPanel/BodyEditor"
import { ActionEventHandler } from "@/page/App/components/Actions/ActionPanel/ActionEventHandler"
import { Resource } from "@/redux/resource/resourceState"

export const RestApiPanel: FC<RestApiPanelProps> = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const currentAction = props.action

  const currentContent = props.action.content

  const currentResource = store
    .getState()
    .resource.find(
      (r) => r.resourceId === currentAction.resourceId,
    ) as Resource<RestApiResource<RestApiAuth>>

  return (
    <div css={restapiPanelContainerStyle}>
      <ResourceChoose action={currentAction} />
      <div css={topDivider} />
      <div css={restapiItemStyle}>
        <span css={restapiItemLabelStyle}>
          {t("editor.action.resource.restapi.label.action_type")}
        </span>
        <Select
          colorScheme="techPurple"
          ml="16px"
          value={currentContent.method}
          width="160px"
          maxW="160px"
          options={["GET", "POST", "PUT", "PATCH", "DELETE"]}
          onChange={(value) => {
            dispatch(configActions.updateSelectedApiMethod(value))
          }}
        />
        <Input
          minW="230px"
          maxW="500px"
          borderColor="techPurple"
          bdRadius="8px 0 0 8px"
          value={currentResource.content.baseUrl}
          ml="8px"
          readOnly
        />
        <CodeEditor
          borderRadius="0 8px 8px 0"
          css={restapiItemInputStyle}
          expectedType={VALIDATION_TYPES.STRING}
          value={currentContent.url}
          mode="TEXT_JS"
          onChange={(value) => {
            dispatch(
              configActions.updateSelectedAction({
                ...currentAction,
                content: {
                  ...currentContent,
                  url: value,
                },
              }),
            )
          }}
        />
      </div>
      <RecordEditor
        records={currentAction.content.urlParams}
        label={t("editor.action.resource.restapi.label.url_parameters")}
        onChangeKey={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiUrlParams({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onChangeValue={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiUrlParams({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onDelete={(index, record) => {
          dispatch(
            configActions.removeSelectedApiUrlParams({
              index: index,
              params: record,
            }),
          )
        }}
        onAdd={() => {
          dispatch(configActions.addSelectedApiEmptyUrlParams())
        }}
      />
      <RecordEditor
        records={currentAction.content.headers}
        label={t("editor.action.resource.restapi.label.headers")}
        onChangeKey={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiHeaders({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onChangeValue={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiHeaders({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onDelete={(index, record) => {
          dispatch(
            configActions.removeSelectedApiHeaders({
              index: index,
              params: record,
            }),
          )
        }}
        onAdd={() => {
          dispatch(configActions.addSelectedApiEmptyHeaders())
        }}
      />
      {currentContent.method !== "GET" && (
        <BodyEditor
          onChangeBody={(body) => {
            dispatch(configActions.updateSelectedApiBody(body))
          }}
          body={currentContent.body}
          bodyType={currentContent.bodyType}
          onChangeRawBodyType={(rawBodyType) => {
            dispatch(configActions.updateSelectedApiRawBodyType(rawBodyType))
          }}
          onChangeBodyType={(bodyType) => {
            dispatch(configActions.updateSelectedApiBodyType(bodyType))
          }}
        />
      )}
      <RecordEditor
        records={currentAction.content.cookies}
        label={t("editor.action.resource.restapi.label.cookies")}
        onChangeKey={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiCookies({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onChangeValue={(index, key, value) => {
          dispatch(
            configActions.addOrUpdateSelectedApiCookies({
              index: index,
              params: {
                key: key,
                value: value,
              } as Params,
            }),
          )
        }}
        onDelete={(index, record) => {
          dispatch(
            configActions.removeSelectedApiCookies({
              index: index,
              params: record,
            }),
          )
        }}
        onAdd={() => {
          dispatch(configActions.addSelectedApiEmptyCookies())
        }}
      />
      <TransformerComponent />
      <ActionEventHandler />
    </div>
  )
}

RestApiPanel.displayName = "RestApiPanel"
