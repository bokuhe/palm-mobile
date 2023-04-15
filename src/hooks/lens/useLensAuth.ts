import { useApolloClient } from '@apollo/client'
import _ from 'lodash'

import useWeb3 from 'hooks/complex/useWeb3'
import { SupportedNetworkEnum, TrueOrErrReturn } from 'types'
import {
  AuthenticateDocument,
  ChallengeDocument,
  AuthenticationResult,
  RefreshDocument,
  VerifyDocument,
} from 'graphqls/__generated__/graphql'
import { parseJwt } from 'libs/utils'

export type UseLensAuthReturn = {
  authenticate: () => Promise<TrueOrErrReturn<AuthenticationResult | null>>
  refreshAuthIfExpired: (
    authResult: AuthenticationResult,
    serverVerify?: boolean
  ) => Promise<TrueOrErrReturn<AuthenticationResult | undefined>>
  refreshAuth: (
    authResult: AuthenticationResult
  ) => Promise<TrueOrErrReturn<AuthenticationResult>>
  verifyAuth: (
    authResult: AuthenticationResult
  ) => Promise<TrueOrErrReturn<boolean>>
}

const useLensAuth = (): UseLensAuthReturn => {
  const { getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)
  const { query: aQuery, mutate: aMutate } = useApolloClient()

  const authenticate = async (): Promise<
    TrueOrErrReturn<AuthenticationResult | null>
  > => {
    const signer = await getSigner()
    if (signer) {
      try {
        /* first request the challenge from the API server */
        const challengeInfo = await aQuery({
          query: ChallengeDocument,
          variables: {
            request: { address: signer.address },
          },
        })

        /* ask the user to sign a message with the challenge info returned from the server */
        const signature = signer.sign(
          challengeInfo.data.challenge.text
        ).signature

        /* authenticate the user */
        const authData = await aMutate({
          mutation: AuthenticateDocument,
          variables: {
            request: {
              address: signer.address,
              signature,
            },
          },
        })

        /* if user authentication is successful, you will receive an accessToken and refreshToken */
        if (
          authData.data?.authenticate?.accessToken &&
          authData.data?.authenticate?.refreshToken
        ) {
          return {
            success: true,
            value: authData.data.authenticate,
          }
        } else {
          return {
            success: true,
            value: null,
          }
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  // returns new auth token if expired, undefined if not expired
  const refreshAuthIfExpired = async (
    authResult: AuthenticationResult,
    serverVerify?: boolean
  ): Promise<TrueOrErrReturn<AuthenticationResult | undefined>> => {
    try {
      if (serverVerify) {
        await verifyAuth(authResult).then(res => {
          if (!res.success) {
            throw new Error(res.errMsg)
          }
        })
      }

      if (!authResult.accessToken || !authResult.refreshToken) {
        throw new Error(
          `useLens:refreshIfExpired invalid Lens auth token ${JSON.stringify(
            authResult
          )}`
        )
      }

      const currTimeInMillisecs = new Date().getTime() / 1000
      const parsed = parseJwt(authResult.accessToken)
      if (!parsed || parsed.iat > currTimeInMillisecs) {
        throw new Error(
          `useLens:refreshIfExpired invalid jwt parsed ${JSON.stringify(
            parsed
          )}`
        )
      }

      if (parsed.exp > currTimeInMillisecs + 60 * 1000) {
        /* 60 seconds buffer */
        return { success: true, value: undefined }
      }
      const res = await refreshAuth(authResult)
      if (!res.success) {
        throw new Error(`useLens:refreshIfExpired failed ${res.errMsg}`)
      }
      return { success: true, value: res.value }
    } catch (e) {
      console.error('useLens:refreshIfExpired error', e)
      return { success: false, errMsg: _.toString(e) }
    }
  }

  const refreshAuth = async (
    authResult: AuthenticationResult
  ): Promise<TrueOrErrReturn<AuthenticationResult>> => {
    const signer = await getSigner()
    if (signer) {
      try {
        const authData = await aMutate({
          mutation: RefreshDocument,
          variables: {
            request: {
              refreshToken: authResult.refreshToken,
            },
          },
        })

        return {
          success: true,
          value: authData.data!.refresh!,
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  const verifyAuth = async (
    authResult: AuthenticationResult
  ): Promise<TrueOrErrReturn<boolean>> => {
    const signer = await getSigner()
    if (signer) {
      try {
        const authData = await aQuery({
          query: VerifyDocument,
          variables: {
            request: { accessToken: authResult.accessToken },
          },
        })

        return {
          success: true,
          value: authData.data!.verify!,
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  return {
    authenticate,
    refreshAuthIfExpired,
    refreshAuth,
    verifyAuth,
  }
}

export default useLensAuth
