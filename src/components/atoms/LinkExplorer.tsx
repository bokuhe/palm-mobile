import { UTIL } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import React, { ReactElement, ReactNode } from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { SupportedNetworkEnum } from 'types'

import Link from './Link'

const LinkExplorer = ({
  address,
  tokenId,
  type,
  children,
  network,
}: {
  address: string
  tokenId?: string
  type: 'tx' | 'address' | 'nft'
  children?: ReactNode
  network: SupportedNetworkEnum
}): ReactElement => {
  const { getLink } = useExplorer(network)

  return children ? (
    <TouchableOpacity
      onPress={(): void => {
        Linking.openURL(getLink({ address, type, tokenId }))
      }}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <Link
      text={UTIL.truncate(address, [10, 10])}
      url={getLink({ address, type, tokenId })}
    />
  )
}

export default LinkExplorer
