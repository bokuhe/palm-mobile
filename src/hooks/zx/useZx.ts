import { getPkey } from 'core/libs/account'
import { QueryKeyEnum, SupportedNetworkEnum } from 'core/types'
import { ethers } from 'ethers'
import { NftSwapV4 } from 'evm-nft-swap'
import useNetwork from 'hooks/complex/useNetwork'
import { useQuery } from 'react-query'

export type UseZxReturn = { nftSwapSdk?: NftSwapV4 }

const useZx = (chain: SupportedNetworkEnum): UseZxReturn => {
  const { connectedNetworkParams, connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[chain]
  const connectedNetworkParam = connectedNetworkParams[chain]

  const { data: nftSwapSdk } = useQuery(
    [QueryKeyEnum.ZX_SWAP_SDK_V4, connectedNetworkParam, connectedNetworkId],
    async () => {
      try {
        const pKey = await getPkey()

        const provider = new ethers.providers.JsonRpcProvider(
          connectedNetworkParam.rpcUrls[0]
        )
        const signer = new ethers.Wallet(pKey, provider)
        return new NftSwapV4(provider, signer, connectedNetworkId)
      } catch {}
    }
  )

  return { nftSwapSdk }
}

export default useZx