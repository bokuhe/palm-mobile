import { FormText } from 'components'
import ChatCard from 'components/exploreTab/ChatCard'
import { COLOR } from 'consts'
import useExploreRecommendChat from 'hooks/page/explore/useExploreRecommendChat'
import { UseExploreSearchReturn } from 'hooks/page/explore/useExploreSearch'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { FbChannel } from 'types'

import { MemberState } from '@sendbird/chat/groupChannel'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

const RecommendChat = ({
  useExploreSearchReturn,
}: {
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const { setSelectedChannel } = useExploreSearchReturn

  const { fsChannelList } = useExploreRecommendChat()
  const { t } = useTranslation()
  const { sdk } = useSendbirdChat()
  const { navigation } = useAppNavigation<Routes.Explore>()

  const onChatCardClick = async (chat: FbChannel): Promise<void> => {
    const channelUrl: string = chat.url
    if (channelUrl) {
      try {
        const channel = await sdk.groupChannel.getChannel(channelUrl)
        if (channel.myMemberState === MemberState.JOINED) {
          navigation.navigate(Routes.GroupChannel, {
            channelUrl,
          })
        }
        return
      } catch {}
    }
    setSelectedChannel(chat)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText font={'B'} size={24}>
            {t('Explore.ExploreChannelsToJoin')}
          </FormText>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.optionResultList}>
          {_.map(fsChannelList, (chat: FbChannel, index) => (
            <ChatCard
              key={`fsChannelList-${index}`}
              chat={chat}
              onClick={onChatCardClick}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

export default RecommendChat

const styles = StyleSheet.create({
  container: { paddingTop: 20 },
  header: { paddingHorizontal: 20 },
  title: {},
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  optionResultList: {
    rowGap: 12,
  },
})
