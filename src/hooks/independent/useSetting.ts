import { UTIL } from 'consts'
import { useEffect, useState } from 'react'
import RNRestart from 'react-native-restart'
import { useQuery } from 'react-query'
import { LocalStorageKey, SettingStorageType } from 'types'

import AsyncStorage from '@react-native-async-storage/async-storage'

export type UseSettingReturn = {
  setting: SettingStorageType
  updateSetting: (setting: SettingStorageType) => Promise<void>
}

const defaultSetting: SettingStorageType = {
  themeMode: 'light',
}

const useSetting = (): UseSettingReturn => {
  const [setting, setSetting] = useState<SettingStorageType>(defaultSetting)

  const { isLoading, isError, data } = useQuery(
    [LocalStorageKey.SETTING],
    async () => {
      const item = await AsyncStorage.getItem(LocalStorageKey.SETTING)
      const r = UTIL.jsonTryParse<SettingStorageType>(item || '')
      if (!r) {
        return r
      }
      if (r.themeMode !== 'dark' && r.themeMode !== 'light') {
        r.themeMode = defaultSetting.themeMode
      }
      return r
    }
  )

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSetting(data)
    }
  }, [data])

  const updateSetting = async (updated: SettingStorageType): Promise<void> => {
    await AsyncStorage.setItem(LocalStorageKey.SETTING, JSON.stringify(updated))
    setSetting(updated)

    RNRestart.restart()
  }

  return { setting, updateSetting }
}

export default useSetting
