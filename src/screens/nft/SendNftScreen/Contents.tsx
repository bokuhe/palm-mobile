import images from 'assets/images'
import { FormButton, FormImage, FormText, MediaRenderer, Row } from 'components'
import NftCard from 'components/channel/NftCard'
import { getFsProfile } from 'libs/firebase'
import { getProfileMediaImg } from 'libs/lens'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FbProfile, Moralis } from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

const Contents = ({
  selectedNft,
  receiverId,
  setShowBottomSheet,
}: {
  selectedNft: Moralis.NftItem
  receiverId: string
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const [receiver, setReceiver] = useState<FbProfile>()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)

  useAsyncEffect(async () => {
    const _receiver = await getFsProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  return (
    <View style={styles.body}>
      <View>
        <View style={{ rowGap: 8, paddingBottom: 28 }}>
          <FormText fontType="SB.14">I want to send this NFT to</FormText>
          <Row style={{ columnGap: 8 }}>
            {receiverProfileImg ? (
              <MediaRenderer
                src={receiverProfileImg}
                width={32}
                height={32}
                style={{ borderRadius: 50 }}
              />
            ) : (
              <FormImage
                source={images.profile_temp}
                size={32}
                style={{ borderRadius: 50 }}
              />
            )}
            <FormText fontType="B.24">{receiver?.handle}</FormText>
          </Row>
        </View>
        <NftCard selectedNft={selectedNft} />
      </View>
      <FormButton
        onPress={(): void => {
          setShowBottomSheet(true)
        }}
      >
        Send
      </FormButton>
    </View>
  )
}

export default Contents

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})