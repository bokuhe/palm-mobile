import { SupportedNetworkEnum } from 'core/types'
import { ethers } from 'ethers'
import useEthers from 'hooks/complex/useEthers'
import useNetwork from 'hooks/complex/useNetwork'
import { useMemo, useState } from 'react'

import { useAsyncEffect } from '@sendbird/uikit-utils'

import lensHubAbi from '../../core/abi/lens-hub-contract-abi.json'
import lensPeripheryAbi from '../../core/abi/lens-periphery-data-provider.json'

export type UseLensHubReturn = {
  lensHub: ethers.Contract | undefined
  lensPeriphery: ethers.Contract | undefined
}

const useLensHub = (chain: SupportedNetworkEnum): UseLensHubReturn => {
  const { contractMap } = useNetwork()
  const { getSigner } = useEthers()
  const [lensHubContract, lensPeripheryContract] = useMemo(
    () => [contractMap[chain].lens_hub!, contractMap[chain].lens_periphery!],
    [contractMap]
  )
  const [lensHub, setLensHub] = useState<ethers.Contract>()
  const [lensPeriphery, setLensPeriphery] = useState<ethers.Contract>()

  useAsyncEffect(async () => {
    const signer = await getSigner(SupportedNetworkEnum.POLYGON)
    if (signer) {
      setLensHub(new ethers.Contract(lensHubContract, lensHubAbi, signer))
      setLensPeriphery(
        new ethers.Contract(lensPeripheryContract, lensPeripheryAbi, signer)
      )
    }
  }, [])

  return {
    lensHub,
    lensPeriphery,
  }
}

export default useLensHub