import { COLOR } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import { ThemeModeType } from 'types'

const ThemeOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<ThemeModeType>(setting.themeMode)

  const [items, setItems] = useState<ItemType<ThemeModeType>[]>([
    { label: 'light', value: 'light' },
    { label: 'dark', value: 'dark' },
  ])

  const onChangeValue = (selected: ThemeModeType | null): void => {
    if (!selected || setting.themeMode === selected) {
      return
    }
    setting.themeMode = selected
    updateSetting(setting)
  }

  useEffect(() => {
    if (setting.themeMode !== value) {
      setValue(setting.themeMode)
    }
  }, [setting])

  return (
    <DropDownPicker
      textStyle={{ color: COLOR.primary._400 }}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={onChangeValue}
      listMode="MODAL"
    />
  )
}

export default ThemeOptions
