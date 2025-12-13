/**
 * ROTK UI Component Library
 * 
 * Romance of the Three Kingdoms themed UI components
 * for the WuXuxian TTRPG webapp.
 * 
 * @see docs/UI_STYLE_GUIDE.md for complete documentation
 */

// Core Components
export { Panel9Slice } from './Panel9Slice';
export type { PanelVariant } from './Panel9Slice';

export { ROTKButton } from './ROTKButton';
export type { ROTKButtonVariant, ROTKButtonSize } from './ROTKButton';

export { StatusChip } from './StatusChip';
export type { ChipVariant } from './StatusChip';

export { StatBar } from './StatBar';
export type { BarType } from './StatBar';

export { DamageNumber, useDamageNumbers } from './DamageNumber';
export type { DamageType } from './DamageNumber';

export { Tooltip } from './Tooltip';

// City/Map Components
export { BuildingPin } from './BuildingPin';
export type { BuildingPinProps } from './BuildingPin';

export { MapMarker } from './MapMarker';
export type { FactionColor } from './MapMarker';

export { DraggableToken } from './DraggableToken';
export type { DraggableTokenProps, TokenVariant, TokenSize } from './DraggableToken';

// Navigation
export { NavBar } from './NavBar';
export type { NavTab } from './NavBar';

// HUD Components
export { ResourceHUD } from './ResourceHUD';
export type { Season } from './ResourceHUD';

// Battle Components
export { CharacterPlate } from './CharacterPlate';
export type { CharacterPlateUnit } from './CharacterPlate';

export { ClashIndicator } from './ClashIndicator';
export type { AdvantageType } from './ClashIndicator';

export { InitiativePanel } from './InitiativePanel';
export type { InitiativeEntry, InitiativePanelProps } from './InitiativePanel';

// Overlay & Dialog Components
export { ScrollOverlay } from './ScrollOverlay';
export type { ScrollOverlayProps, OverlayVariant, OverlaySize, TransitionStyle } from './ScrollOverlay';

export { EventChoiceDialog } from './EventChoiceDialog';
export type { EventChoiceDialogProps, DialogChoice } from './EventChoiceDialog';

export { CharacterPortraitOverlay } from './CharacterPortraitOverlay';
