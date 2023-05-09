import { FormText, MoralisNftRenderer } from 'components'
import { COLOR } from 'consts'
import useCollectionNfts from 'hooks/api/useCollectionNfts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

const NftList = ({
  useGcInputReturn,
  userAddress,
  selectedCollection,
  setSelectedCollection,
  selectedNetwork,
}: {
  useGcInputReturn: UseGcInputReturn
  userAddress?: ContractAddr
  selectedCollection: Moralis.NftCollection
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Moralis.NftCollection | undefined>
  >
  selectedNetwork: SupportedNetworkEnum
}): ReactElement => {
  const { items, fetchNextPage, hasNextPage, isLoading } = useCollectionNfts({
    selectedNetwork,
    userAddress,
    contractAddress: selectedCollection.token_address,
  })

  return (
    <FlatList
      data={items}
      ListEmptyComponent={(): ReactElement =>
        isLoading ? (
          <View style={{ paddingTop: 16 }}>
            <ActivityIndicator color={COLOR.primary._400} />
          </View>
        ) : (
          <></>
        )
      }
      ListHeaderComponent={(): ReactElement => (
        <TouchableOpacity
          style={{
            paddingBottom: 8,
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
          }}
          onPress={(): void => {
            setSelectedCollection(undefined)
          }}
        >
          <Icon name="ios-chevron-back" color={COLOR.black._800} size={16} />
          <FormText fontType="B.12">{selectedCollection.name}</FormText>
        </TouchableOpacity>
      )}
      keyExtractor={(_, index): string => `nftList-${index}`}
      style={{ paddingHorizontal: 8, paddingTop: 20 }}
      contentContainerStyle={{ gap: 8 }}
      columnWrapperStyle={{ gap: 8 }}
      numColumns={3}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => {
        const selectedIndex = useGcInputReturn.selectedNftList.findIndex(
          x =>
            x.token_address === item.token_address &&
            x.token_id === item.token_id
        )

        return (
          <View style={{ flex: 1 / 3, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={(): void => {
                if (useGcInputReturn.stepAfterSelectNft === 'share') {
                  useGcInputReturn.setSelectedNftList(valOrUpdater => {
                    if (selectedIndex > -1) {
                      return valOrUpdater.filter(x => x !== item)
                    } else {
                      // Send up to N at a time.
                      if (useGcInputReturn.selectedNftList.length < 3) {
                        return [...valOrUpdater, item]
                      } else {
                        return valOrUpdater
                      }
                    }
                  })
                } else {
                  useGcInputReturn.setSelectedNftList([item])
                }
              }}
            >
              <MoralisNftRenderer item={item} width={104} height={104} />
              <View
                style={[
                  styles.selectItemIcon,
                  {
                    backgroundColor:
                      selectedIndex > -1 ? COLOR.primary._400 : 'white',
                  },
                ]}
              >
                {selectedIndex > -1 && (
                  <FormText fontType="B.12" color="white">
                    {selectedIndex + 1}
                  </FormText>
                )}
              </View>
              <View style={styles.nftTitle}>
                <FormText
                  numberOfLines={1}
                  style={{ fontSize: 10 }}
                >{`#${item.token_id}`}</FormText>
              </View>
            </TouchableOpacity>
          </View>
        )
      }}
    />
  )
}

export default NftList

const styles = StyleSheet.create({
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
  },
  selectItemIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.primary._400,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
})