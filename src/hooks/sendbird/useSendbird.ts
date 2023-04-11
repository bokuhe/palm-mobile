import { useSendbirdChat } from '@sendbird/uikit-react-native'
import {
  GroupChannel,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel'
import { v5 as uuidv5 } from 'uuid'

export type CreateGroupChatInput = {
  channelUrl: string
  invitedUserIds: string[]
  isDistinct?: boolean
  coverUrl?: string
  channelName?: string
  operatorUserIds?: string[]
  onChannelCreated?: ((channel: GroupChannel) => void) | undefined
  onError?: ((e: unknown) => void) | undefined
}

export type UseSendbirdReturn = {
  createGroupChatIfNotExist: ({
    channelUrl,
    invitedUserIds,
    channelName,
    operatorUserIds,
    onChannelCreated,
    onError,
  }: CreateGroupChatInput) => Promise<void>
  generateDmChannelUrl: (a: string | undefined, b: string | undefined) => string
}

const useSendbird = (): UseSendbirdReturn => {
  const { sdk } = useSendbirdChat()

  const createGroupChatIfNotExist = async ({
    channelUrl,
    invitedUserIds,
    coverUrl,
    isDistinct,
    channelName,
    operatorUserIds,
    onChannelCreated,
    onError,
  }: CreateGroupChatInput): Promise<void> => {
    let channel
    try {
      channel = await sdk.groupChannel.getChannel(channelUrl)
    } catch (e) {
      console.error('getChannel Error: ', e, channelUrl)
      const params: GroupChannelCreateParams = {
        channelUrl,
        invitedUserIds: invitedUserIds,
        name: channelName,
        coverUrl,
        isDistinct,
      }
      params.operatorUserIds = operatorUserIds
      channel = await sdk.groupChannel.createChannel(params)
    }

    if (channel) {
      onChannelCreated?.(channel)
    } else {
      onError?.(`Failed to create the sendbird channel for ${channelUrl}`)
    }
  }

  const generateDmChannelUrl = (
    a: string | undefined,
    b: string | undefined
  ): string => uuidv5([String(a), String(b)].sort().join('-'), uuidv5.DNS)

  return { createGroupChatIfNotExist, generateDmChannelUrl }
}

export default useSendbird
