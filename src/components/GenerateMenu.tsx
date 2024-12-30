// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type {
  VerticalMenuDataType,
  VerticalSectionDataType,
  VerticalSubMenuDataType,
  VerticalMenuItemDataType,
} from '@/types/menuTypes'

// Component Imports
import { SubMenu as VerticalSubMenu, MenuItem as VerticalMenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

export const GenerateVerticalMenu = ({ menuData }: { menuData: VerticalMenuDataType[] }) => {

  const renderMenuItems = (data: VerticalMenuDataType[]) => {
    return data?.map((item: VerticalMenuDataType, index: number) => {
      const menuSectionItem = item as VerticalSectionDataType
      const subMenuItem = item as VerticalSubMenuDataType
      const menuItem = item as VerticalMenuItemDataType

      if (menuSectionItem.isSection) {
        const { children, ...rest } = menuSectionItem

        return (
          <MenuSection key={index} {...rest}>
            {children && renderMenuItems(children)}
          </MenuSection>
        )
      }

      if (subMenuItem.submenu && subMenuItem.submenu.length > 0) {
        const { submenu, icon, prefix, suffix, ...rest } = subMenuItem

        const Icon = icon ? <i className={icon} /> : null

        const subMenuPrefix: ReactNode =
          prefix && (prefix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
          ) : (
            (prefix as ReactNode)
          )

        const subMenuSuffix: ReactNode =
          suffix && (suffix as ChipProps).label ? (
            <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
          ) : (
            (suffix as ReactNode)
          )

        return (
          <VerticalSubMenu
            key={index}
            prefix={subMenuPrefix}
            suffix={subMenuSuffix}
            submenu={submenu}
            {...rest}
            {...(Icon && { icon: Icon })}
          >
            {submenu && renderMenuItems(submenu)}
          </VerticalSubMenu>
        )
      }

      const { menu, icon, prefix, suffix, ...rest } = menuItem

      const url = rest.url

      const Icon = icon ? <i className={icon} /> : null

      const menuItemPrefix: ReactNode =
        prefix && (prefix as ChipProps).label ? (
          <CustomChip size='small' round='true' {...(prefix as ChipProps)} />
        ) : (
          (prefix as ReactNode)
        )

      const menuItemSuffix: ReactNode =
        suffix && (suffix as ChipProps).label ? (
          <CustomChip size='small' round='true' {...(suffix as ChipProps)} />
        ) : (
          (suffix as ReactNode)
        )

      return (
        <VerticalMenuItem
          key={index}
          prefix={menuItemPrefix}
          suffix={menuItemSuffix}
          {...rest}
          href={url}
          {...(Icon && { icon: Icon })}
        >
          {menu}
        </VerticalMenuItem>
      )
    })
  }

  return <>{renderMenuItems(menuData)}</>
}
