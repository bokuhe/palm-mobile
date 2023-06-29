import images from 'assets/images'
import {
  Container,
  FormImage,
  FormInput,
  FormText,
  Header,
  Row,
  Tag,
} from 'components'
import { COLOR, UTIL } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import useEditChannel from 'hooks/page/groupChannel/useEditChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import TokenGating from './TokenGating'

const EditChannelScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.EditChannel>()
  const useEditChannelReturn = useEditChannel({ channelUrl: params.channelUrl })
  const { user } = useAuth()
  const { profile } = useProfile({ profileId: user?.auth?.profileId })
  const { t } = useTranslation()

  const {
    prevCoverImage,
    channelImage,
    tags,
    inputTag,
    setInputTag,
    channelName,
    setChannelName,
    desc,
    setDesc,
    showTokenGating,
    setShowTokenGating,
    isValidForm,
    onClickGetFile,
    onClickConfirm,
    selectedGatingToken,
    setSelectedGatingToken,
    defaultGatingToken,
  } = useEditChannelReturn

  return (
    <>
      <Container style={styles.container} keyboardAvoiding={true}>
        <ScrollView>
          <Header
            left="back"
            onPressLeft={navigation.goBack}
            right={
              <Icon
                name="ios-checkmark-circle"
                color={isValidForm ? COLOR.primary._400 : COLOR.black._400}
                size={36}
              />
            }
            onPressRight={isValidForm ? onClickConfirm : undefined}
          />
          <View style={styles.selectImageSection}>
            <TouchableOpacity onPress={onClickGetFile}>
              {channelImage || prevCoverImage ? (
                <View style={{ borderRadius: 999, overflow: 'hidden' }}>
                  <FormImage
                    source={channelImage || { uri: prevCoverImage }}
                    size={100}
                  />
                </View>
              ) : (
                <FormImage
                  source={images.select_image}
                  style={{ height: 100, width: 112 }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <FormText color={COLOR.black._400}>
                {t('Channels.ChatRoomName')}
              </FormText>
              <FormInput
                value={channelName}
                placeholder={t('Channels.ChatRoomNamePlaceholder', {
                  name: profile?.handle,
                })}
                onChangeText={setChannelName}
              />
            </View>
            <View style={styles.infoRow}>
              <FormText color={COLOR.black._400}>
                {t('Channels.ChatRoomDescription')}
              </FormText>
              <FormInput
                value={desc}
                onChangeText={setDesc}
                multiline={true}
                placeholder={t('Channels.ChatRoomDescriptionPlaceholder')}
                style={{ height: 100 }}
              />
            </View>
            <View style={styles.infoRow}>
              <FormText color={COLOR.black._400}>
                {t('Channels.ChatRoomTag')}
              </FormText>
              <FormInput
                value={inputTag}
                onChangeText={setInputTag}
                placeholder={t('Channels.ChatRoomTagPlaceholder')}
              />
              <ScrollView style={{ maxHeight: 80 }}>
                <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                  {_.map(tags, (tag, index) => {
                    return <Tag key={`inputTagList-${index}`} title={tag} />
                  })}
                </Row>
              </ScrollView>
            </View>
            <View style={styles.infoRow}>
              <FormText color={COLOR.black._400}>
                {t('Channels.ChatRoomTokenGating')}
              </FormText>

              {selectedGatingToken.amount ? (
                <View style={{ rowGap: 4 }}>
                  <TouchableOpacity
                    style={styles.tokenGatingSelectBox}
                    onPress={(): void => {
                      setSelectedGatingToken(defaultGatingToken)
                    }}
                  >
                    <View style={{ rowGap: 4, flex: 1 }}>
                      <FormText>
                        {typeof selectedGatingToken === 'string'
                          ? selectedGatingToken
                          : selectedGatingToken.name}
                      </FormText>
                      <FormText color={COLOR.black._200}>
                        {t('Channels.ChatRoomTokenGatingMinimum', {
                          amount: UTIL.setComma(selectedGatingToken.amount),
                        })}
                      </FormText>
                    </View>
                    <Icon
                      name="ios-close-outline"
                      color={COLOR.black._200}
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editTokenGating}
                    onPress={(): void => {
                      setShowTokenGating(true)
                    }}
                  >
                    <FormText color={COLOR.black._200}>
                      {t('Channels.ChatRoomEditTokenGating')}
                    </FormText>
                    <Icon
                      name="chevron-forward"
                      color={COLOR.black._200}
                      size={14}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.tokenGatingSelectBox}
                  onPress={(): void => {
                    setShowTokenGating(true)
                  }}
                >
                  <View
                    style={{
                      borderRadius: 14,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: COLOR.black._90010,
                      width: 64,
                      height: 64,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    <Icon name="add" size={38} color={COLOR.black._100} />
                  </View>
                  <FormText color={COLOR.black._200}>
                    {t('Channels.ChatRoomTokenGatingSelect')}
                  </FormText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </Container>
      {showTokenGating && (
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <TokenGating useEditChannelReturn={useEditChannelReturn} />
        </View>
      )}
    </>
  )
}

export default EditChannelScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectImageSection: {
    height: 240,
    backgroundColor: COLOR.black._90005,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    rowGap: 20,
    padding: 20,
  },
  infoRow: {
    rowGap: 4,
  },
  tokenGatingSelectBox: {
    flexDirection: 'row',
    width: '100%',
    height: 88,
    backgroundColor: COLOR.black._90005,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    columnGap: 16,
  },
  editTokenGating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.black._100,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
})
