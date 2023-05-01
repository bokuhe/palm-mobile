import { FormImage } from 'components'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, SbUserMetadata } from 'types'

import { Member } from '@sendbird/chat/groupChannel'
import {
  GroupChannelContexts,
  GroupChannelProps,
  useLocalization,
} from '@sendbird/uikit-react-native'
import {
  Avatar,
  createStyleSheet,
  Header,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'

const GroupChannelHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelProps['Header']): ReactElement => {
  const { user } = useAuth()
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)

  const isMyDM =
    channel.memberCount === 2 &&
    channel.members.filter(
      (member: Member) => member.userId === user?.auth?.profileId
    ).length === 1
  const otherDMUser: Member | undefined = isMyDM
    ? channel.members.filter(
        (member: Member) => member.userId !== user?.auth?.profileId
      )[0]
    : undefined

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          {otherDMUser ? (
            <TouchableOpacity
              onPress={(): void => {
                navigation.navigate(Routes.UserProfile, {
                  address: (otherDMUser.metaData as SbUserMetadata).address,
                  profileId: otherDMUser.userId,
                })
              }}
            >
              <Avatar
                size={36}
                uri={otherDMUser.profileUrl}
                containerStyle={styles.avatarGroup}
              />
            </TouchableOpacity>
          ) : (
            channel.coverUrl && (
              <FormImage
                source={{ uri: channel.coverUrl }}
                size={36}
                style={styles.avatarGroup}
              />
            )
          )}
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {Boolean(subtitle) && subtitle && (
              <Header.Subtitle style={styles.subtitle}>
                {subtitle}
              </Header.Subtitle>
            )}
          </View>
        </View>
      }
      left={<Icon name="chevron-back-outline" size={28} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon name="menu-outline" size={28} />}
      onPressRight={onPressHeaderRight}
    />
  )
}

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
})

export default GroupChannelHeader
