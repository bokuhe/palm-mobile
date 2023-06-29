import { FormImage, FormText, NftRenderer, Row } from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import { format } from 'date-fns'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { FbListing, NftType, SupportedNetworkEnum, pToken } from 'types'

const FbListingItem = ({
  item,
  channelUrl,
}: {
  item: FbListing
  channelUrl: string
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const { getEthPrice } = useEthPrice()
  const { getKlayPrice } = useKlayPrice()
  const { t } = useTranslation()

  const order = item.order
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(order.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const expire = format(
    new Date(_.toNumber(order.order.expiry) * 1000),
    'yyyy-MM-dd'
  )

  const usdPrice = useMemo(
    () =>
      chain === SupportedNetworkEnum.ETHEREUM
        ? getEthPrice(order.erc20TokenAmount as pToken)
        : chain === SupportedNetworkEnum.KLAYTN
        ? getKlayPrice(order.erc20TokenAmount as pToken)
        : ('0' as pToken),
    []
  )

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={async (): Promise<void> => {
        navigation.push(Routes.ZxNftDetail, {
          nonce: order.order.nonce,
          chain,
          channelUrl,
        })
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <NftRenderer
          tokenId={item.tokenId}
          nftContract={item.nftContract}
          type={order.nftType as NftType}
          width={'100%'}
          height={172}
          chain={chain}
          hideChain
          style={{ maxWidth: 'auto' }}
        />
      </View>
      <View style={styles.verifiedBox}>
        <MaterialIcons name="verified" color={COLOR.primary._400} size={28} />
      </View>
      <Row style={styles.expiryBox}>
        <MaterialIcons
          name="access-time"
          color={COLOR.primary._400}
          size={14}
        />
        <FormText color={COLOR.primary._400}>{expire}</FormText>
      </Row>
      <View style={styles.info}>
        <Row style={{ alignItems: 'center', columnGap: 4 }}>
          <FormImage source={NETWORK.getNetworkLogo(chain)} size={14} />
          <FormText font={'B'}>
            {UTIL.formatAmountP(order.erc20TokenAmount as pToken)}
          </FormText>
        </Row>
        <View>
          <FormText color={COLOR.black._400}>
            {t('Common.UsdPrice', {
              price: UTIL.formatAmountP(usdPrice, { toFix: 2 }),
            })}
          </FormText>
        </View>
        <View>
          <FormText color={COLOR.black._400}>
            {t('Channels.ListedBy', { maker: order.order.maker.slice(-5) })}
          </FormText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FbListingItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
  },
  verifiedBox: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  expiryBox: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffffbf',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    columnGap: 5,
  },
  info: { padding: 12 },
})
