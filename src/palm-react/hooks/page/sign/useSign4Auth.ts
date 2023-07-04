import _ from 'lodash'
import { recordError } from 'palm-core/libs/logger'
import {
  AuthChallengeInfo,
  ContractAddr,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useAuthChallenge from 'palm-react/hooks/api/useAuthChallenge'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useWeb3 from 'palm-react/hooks/complex/useWeb3'
import appStore from 'palm-react/store/appStore'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { Account } from 'web3-core'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

export type UseSign4AuthReturn = {
  challenge?: AuthChallengeInfo
  signChallenge: () => Promise<void>
}

const useSign4Auth = (): UseSign4AuthReturn => {
  const { appSignIn } = useAuth()
  const setLoading = useSetRecoilState(appStore.loading)
  const { getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)
  const [challenge, setChallenge] = useState<AuthChallengeInfo>()
  const [signer, setSigner] = useState<Account>()
  const { challengeRequest, challengeVerify } = useAuthChallenge(
    SupportedNetworkEnum.ETHEREUM
  )
  const { alert } = useAlert()
  const { t } = useTranslation()

  const signChallenge = async (): Promise<void> => {
    setLoading(true)
    if (challenge && signer) {
      try {
        const signature = signer.sign(challenge.message).signature
        const result = await challengeVerify(signature, challenge.message)
        await appSignIn(result)
      } catch (e) {
        recordError(e, 'signChallenge')
        alert({
          title: t('Auth.Sign4AuthFailureAlertTitle'),
          message: _.toString(e),
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const _getChallenge = async (): Promise<void> => {
    const _account = await getSigner()
    setSigner(_account)
    const _challenge = await challengeRequest(_account?.address as ContractAddr)
    setChallenge(_challenge)
    setLoading(false)
  }

  useEffect(() => {
    _getChallenge()
  }, [])

  return { challenge, signChallenge }
}

export default useSign4Auth