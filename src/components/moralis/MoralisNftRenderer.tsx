import NftRenderer from 'components/molecules/NftRenderer'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import { FlexStyle } from 'react-native'
import { Moralis, SupportedNetworkEnum } from 'types'

import MediaRenderer from '../molecules/MediaRenderer'

const MoralisNftRenderer = ({
  item,
  width,
  height,
  resolution = 'medium',
  hideChain,
}: {
  item: Moralis.NftItem
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  resolution?: 'low' | 'medium' | 'high'
  hideChain?: boolean
}): ReactElement => {
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const previewUri = item.media?.media_collection?.[resolution]?.url

  return previewUri ? (
    <MediaRenderer
      src={previewUri}
      alt={`${item.name}:${item.token_id}`}
      width={width}
      height={height}
    />
  ) : (
    <NftRenderer
      nftContract={item.token_address}
      tokenId={item.token_id}
      type={item.contract_type}
      metadata={item.metadata}
      chain={chain}
      width={width}
      height={height}
      hideChain={hideChain}
    />
  )
}

export default MoralisNftRenderer
