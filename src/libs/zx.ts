import {
  SignedERC1155OrderStructSerialized,
  SignedERC721OrderStructSerialized,
  SignedNftOrderV4,
  SignedNftOrderV4Serialized,
} from 'evm-nft-swap'
import { ContractAddr } from 'types'

export const serializeNftOrder = (
  signedOrder: SignedNftOrderV4
): SignedNftOrderV4Serialized => {
  if ('erc721Token' in signedOrder) {
    return {
      ...signedOrder,
      direction: parseInt(signedOrder.direction.toString(), 10),
      expiry: signedOrder.expiry.toString(),
      nonce: signedOrder.nonce.toString(),
      erc20TokenAmount: signedOrder.erc20TokenAmount.toString(),
      fees: signedOrder.fees.map(fee => ({
        ...fee,
        amount: fee.amount.toString(),
        feeData: fee.feeData.toString(),
      })),
      erc721TokenId: signedOrder.erc721TokenId.toString(),
    }
  } else if ('erc1155Token' in signedOrder) {
    return {
      ...signedOrder,
      direction: parseInt(signedOrder.direction.toString(), 10),
      expiry: signedOrder.expiry.toString(),
      nonce: signedOrder.nonce.toString(),
      erc20TokenAmount: signedOrder.erc20TokenAmount.toString(),
      fees: signedOrder.fees.map(fee => ({
        ...fee,
        amount: fee.amount.toString(),
        feeData: fee.feeData.toString(),
      })),
      erc1155TokenAmount: signedOrder.erc1155TokenAmount.toString(),
      erc1155TokenId: signedOrder.erc1155TokenId.toString(),
    }
  } else {
    console.error(
      'unknown order format type (not erc721 and not erc1155',
      signedOrder
    )
    throw new Error('Unknown asset type')
  }
}

export const getOrderTokenId = (order: SignedNftOrderV4Serialized): string =>
  (order as SignedERC721OrderStructSerialized).erc721TokenId ||
  (order as SignedERC1155OrderStructSerialized).erc1155TokenId

export const getOrderTokenAddress = (
  order: SignedNftOrderV4Serialized
): ContractAddr =>
  ((order as SignedERC721OrderStructSerialized).erc721Token ||
    (order as SignedERC1155OrderStructSerialized).erc1155Token) as ContractAddr