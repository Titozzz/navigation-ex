import {
  StyleProp,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { EdgeInsets } from 'react-native-safe-area-context';
import {
  NavigationProp,
  ParamListBase,
  Descriptor,
  Route,
  NavigationHelpers,
} from '@react-navigation/core';
import { StackNavigationState } from '@react-navigation/routers';

export type StackNavigationEventMap = {
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { closing: boolean };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { closing: boolean };
};

export type StackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  StackNavigationEventMap
>;

export type StackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState,
  StackNavigationOptions,
  StackNavigationEventMap
> & {
  /**
   * Push a new screen onto the stack.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  push<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends undefined | any
      ? [RouteName] | [RouteName, ParamList[RouteName]]
      : [RouteName, ParamList[RouteName]]
  ): void;

  /**
   * Pop a screen from the stack.
   */
  pop(count?: number): void;

  /**
   * Pop to the first route in the stack, dismissing all other screens.
   */
  popToTop(): void;
};

export type Layout = { width: number; height: number };

export type GestureDirection = 'horizontal' | 'vertical';

export type Scene<T> = {
  /**
   * Current route object,
   */
  route: T;
  /**
   * Descriptor object for the route containing options and navigation object.
   */
  descriptor: StackDescriptor;
  /**
   * Animated nodes representing the progress of the animation.
   */
  progress: {
    /**
     * Progress value of the current screen.
     */
    current: Animated.Node<number>;
    /**
     * Progress value for the screen after this one in the stack.
     * This can be `undefined` in case the screen animating is the last one.
     */
    next?: Animated.Node<number>;
    /**
     * Progress value for the screen before this one in the stack.
     * This can be `undefined` in case the screen animating is the first one.
     */
    previous?: Animated.Node<number>;
  };
};

export type StackHeaderMode = 'float' | 'screen' | 'none';

export type StackHeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to scene `title`.
   * It receives `allowFontScaling`, `onLayout`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?: string | ((props: StackHeaderTitleProps) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: 'left' | 'center';
  /**
   * Style object for the title component.
   */
  headerTitleStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the container of the `headerTitle` component, for example to add padding.
   * By default, `headerTitleContainerStyle` is with an absolute position style and offsets both `left` and `right`.
   * This may lead to white space or overlap between `headerLeft` and `headerTitle` if a customized `headerLeft` is used.
   * It can be solved by adjusting `left` and `right` style in `headerTitleContainerStyle` and `marginHorizontal` in `headerTitleStyle`.
   */
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Tint color for the header.
   */
  headerTintColor?: string;
  /**
   * Whether header title font should scale to respect Text Size accessibility settings. Defaults to `false`.
   */
  headerTitleAllowFontScaling?: boolean;
  /**
   * Whether back button title font should scale to respect Text Size accessibility settings. Defaults to `false`.
   */
  headerBackAllowFontScaling?: boolean;
  /**
   * Title string used by the back button on iOS, or `null` to disable label. Defaults to the previous scene's `headerTitle`.
   */
  headerBackTitle?: string;
  /**
   * Style object for the back title.
   */
  headerBackTitleStyle?: StyleProp<TextStyle>;
  /**
   * A reasonable default is supplied for whether the back button title should be visible or not.
   * But if you want to override that you can use `true` or `false` in this option.
   */
  headerBackTitleVisible?: boolean;
  /**
   * Title string used by the back button when `headerBackTitle` doesn't fit on the screen. `"Back"` by default.
   */
  headerTruncatedBackTitle?: string;
  /**
   * Function which returns a React Element to display on the left side of the header.
   * It receives a number of arguments when rendered (`onPress`, `label`, `labelStyle` and more.
   */
  headerLeft?: (props: StackHeaderLeftButtonProps) => React.ReactNode;
  /**
   * Style object for the container of the `headerLeft` component, for example to add padding.
   */
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Style object for the container of the `headerRight` component, for example to add padding.
   */
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Function which returns a React Element to display custom image in header's back button.
   * It receives the `tintColor` in in the options object as an argument. object.
   * Defaults to Image component with a the default back icon image for the platform (a chevron on iOS and an arrow on Android).
   */
  headerBackImage?: StackHeaderLeftButtonProps['backImage'];
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressColorAndroid?: string;
  /**
   * Function which returns a React Element to render as the background of the header.
   * This is useful for using backgrounds such as an image or a gradient.
   * You can use this with `headerTransparent` to render a blur view, for example, to create a translucent header.
   */
  headerBackground?: (props: {
    style: StyleProp<ViewStyle>;
  }) => React.ReactNode;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerBackground`.
   * The header will also float over the screen so that it overlaps the content underneath.
   * This is useful if you want to render a semi-transparent header or a blurred background.
   */
  headerTransparent?: boolean;
};

export type StackHeaderProps = {
  /**
   * Mode of the header: `float` renders a single floating header across all screens,
   * `screen` renders separate headers for each screen.
   */
  mode: 'float' | 'screen';
  /**
   * Layout of the screen.
   */
  layout: Layout;
  /**
   * Safe area insets to use in the header, e.g. to apply extra spacing for statusbar and notch.
   */
  insets: EdgeInsets;
  /**
   * Object representing the current scene, such as the route object and animation progress.
   */
  scene: Scene<Route<string>>;
  /**
   * Object representing the previous scene.
   */
  previous?: Scene<Route<string>>;
  /**
   * Navigation prop for the header.
   */
  navigation: StackNavigationProp<ParamListBase>;
  /**
   * Interpolated styles for various elements in the header.
   */
  styleInterpolator: StackHeaderStyleInterpolator;
};

export type StackDescriptor = Descriptor<
  ParamListBase,
  string,
  StackNavigationState,
  StackNavigationOptions
>;

export type StackDescriptorMap = {
  [key: string]: StackDescriptor;
};

export type StackNavigationOptions = StackHeaderOptions &
  Partial<TransitionPreset> & {
    /**
     * String that can be displayed in the header as a fallback for `headerTitle`.
     */
    title?: string;
    /**
     * Function that given `HeaderProps` returns a React Element to display as a header.
     */
    header?: (props: StackHeaderProps) => React.ReactNode;
    /**
     * Whether to show the header. The header is shown by default unless `headerMode` was set to `none`.
     * Setting this to `false` hides the header.
     */
    headerShown?: boolean;
    /**
     * Whether a shadow is visible for the card during transitions. Defaults to `true`.
     */
    cardShadowEnabled?: boolean;
    /**
     * Whether to have a semi-transparent dark overlay visible under the card during transitions.
     * Defaults to `true` on Android and `false` on iOS.
     */
    cardOverlayEnabled?: boolean;
    /**
     * Whether to use a transparent background for the card instead of a white one.
     * This is useful to implement things like modal dialogs where the previous scene should still be visible underneath the current one.
     * Defaults to `false`.
     *
     * If you use [`react-native-screens`](https://github.com/kmagiera/react-native-screens),
     * you should also specify `mode: 'modal'` in the stack view config so previous screens aren't detached.
     */
    cardTransparent?: boolean;
    /**
     * Style object for the card in stack.
     * You can provide a custom background color to use instead of the default background here.
     */
    cardStyle?: StyleProp<ViewStyle>;
    /**
     * Whether transition animation should be enabled the screen.
     * If you set it to `false`, the screen won't animate when pushing or popping. Defaults to `true`.
     */
    animationEnabled?: boolean;
    /**
     * Whether you can use gestures to dismiss this screen. Defaults to `true` on iOS, `false` on Android.
     */
    gestureEnabled?: boolean;
    /**
     * Object to override the distance of touch start from the edge of the screen to recognize gestures.
     */
    gestureResponseDistance?: {
      /**
       * Distance for horizontal direction. Defaults to 25.
       */
      vertical?: number;
      /**
       * Distance for vertical direction. Defaults to 135.
       */
      horizontal?: number;
    };
    /**
     * Number which determines the relevance of velocity for the gesture.
     * Defaults to 0.3.
     */
    gestureVelocityImpact?: number;
    /**
     * Safe area insets for the screen. This is used to avoid elements like notch and status bar.
     * By default, the device's safe area insets are automatically detected. You can override the behavior with this option.
     * For example, to remove the extra spacing for status bar, pass `safeAreaInsets: { top: 0 }`.
     */
    safeAreaInsets?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };

export type StackNavigationConfig = {
  mode?: 'card' | 'modal';
  headerMode?: StackHeaderMode;
  /**
   * If `false`, the keyboard will NOT automatically dismiss when navigating to a new screen.
   * Defaults to `true`.
   */
  keyboardHandlingEnabled?: boolean;
};

export type StackHeaderLeftButtonProps = {
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Callback to call when the button is pressed.
   * By default, this triggers `goBack`.
   */
  onPress?: () => void;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  pressColorAndroid?: string;
  /**
   * Function which returns a React Element to display custom image in header's back button.
   */
  backImage?: (props: { tintColor: string }) => React.ReactNode;
  /**
   * Tint color for the header.
   */
  tintColor?: string;
  /**
   * Label text for the button. Usually the title of the previous screen.
   * By default, this is only shown on iOS.
   */
  label?: string;
  /**
   * Label text to show when there isn't enough space for the full label.
   */
  truncatedLabel?: string;
  /**
   * Whether the label text is visible.
   * Defaults to `true` on iOS and `false` on Android.
   */
  labelVisible?: boolean;
  /**
   * Style object for the label.
   */
  labelStyle?: React.ComponentProps<typeof Animated.Text>['style'];
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Callback to trigger when the size of the label changes.
   */
  onLabelLayout?: (e: LayoutChangeEvent) => void;
  /**
   * Layout of the screen.
   */
  screenLayout?: Layout;
  /**
   * Layout of the title element in the header.
   */
  titleLayout?: Layout;
  /**
   * Whether it's possible to navigate back in stack.
   */
  canGoBack?: boolean;
};

export type StackHeaderTitleProps = {
  /**
   * Callback to trigger when the size of the title element changes.
   */
  onLayout: (e: LayoutChangeEvent) => void;
  /**
   * Whether title font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
  /**
   * Content of the title element. Usually the title string.
   */
  children?: string;
  /**
   * Style object for the title element.
   */
  style?: StyleProp<TextStyle>;
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: StackNavigationOptions & {
    [key: string]: any;
  };
};

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
  overshootClamping: boolean;
};

export type TimingConfig = {
  duration: number;
  easing: Animated.EasingFunction;
};

export type TransitionSpec =
  | { animation: 'spring'; config: SpringConfig }
  | { animation: 'timing'; config: TimingConfig };

export type StackCardInterpolationProps = {
  /**
   * Values for the current screen.
   */
  current: {
    /**
     * Animated node representing the progress value of the current screen.
     */
    progress: Animated.Node<number>;
  };
  /**
   * Values for the current screen the screen after this one in the stack.
   * This can be `undefined` in case the screen animating is the last one.
   */
  next?: {
    /**
     * Animated node representing the progress value of the next screen.
     */
    progress: Animated.Node<number>;
  };
  /**
   * The index of the card in the stack.
   */
  index: number;
  /**
   * Animated node representing whether the card is closing.
   */
  closing: Animated.Node<0 | 1>;
  /**
   * Layout measurements for various items we use for animation.
   */
  layouts: {
    /**
     * Layout of the whole screen.
     */
    screen: Layout;
  };
  /**
   * Safe area insets
   */
  insets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type StackCardInterpolatedStyle = {
  /**
   * Interpolated style for the container view wrapping the card.
   */
  containerStyle?: any;
  /**
   * Interpolated style for the view representing the card.
   */
  cardStyle?: any;
  /**
   * Interpolated style for the view representing the semi-transparent overlay below the card.
   */
  overlayStyle?: any;
  /**
   * Interpolated style representing the card shadow.
   */
  shadowStyle?: any;
};

export type StackCardStyleInterpolator = (
  props: StackCardInterpolationProps
) => StackCardInterpolatedStyle;

export type StackHeaderInterpolationProps = {
  /**
   * Values for the current screen (the screen which owns this header).
   */
  current: {
    /**
     * Animated node representing the progress value of the current screen.
     */
    progress: Animated.Node<number>;
  };
  /**
   * Values for the current screen the screen after this one in the stack.
   * This can be `undefined` in case the screen animating is the last one.
   */
  next?: {
    /**
     * Animated node representing the progress value of the next screen.
     */
    progress: Animated.Node<number>;
  };
  /**
   * Layout measurements for various items we use for animation.
   */
  layouts: {
    /**
     * Layout of the whole screen.
     */
    screen: Layout;
    /**
     * Layout of the title element.
     */
    title?: Layout;
    /**
     * Layout of the back button label.
     */
    leftLabel?: Layout;
  };
};

export type StackHeaderInterpolatedStyle = {
  /**
   * Interpolated style for the label of the left button (back button label).
   */
  leftLabelStyle?: any;
  /**
   * Interpolated style for the left button (usually the back button).
   */
  leftButtonStyle?: any;
  /**
   * Interpolated style for the right button.
   */
  rightButtonStyle?: any;
  /**
   * Interpolated style for the header title text.
   */
  titleStyle?: any;
  /**
   * Interpolated style for the header background.
   */
  backgroundStyle?: any;
};

export type StackHeaderStyleInterpolator = (
  props: StackHeaderInterpolationProps
) => StackHeaderInterpolatedStyle;

export type TransitionPreset = {
  /**
   * The direction of swipe gestures, `horizontal` or `vertical`.
   */
  gestureDirection: GestureDirection;
  /**
   * Object which specifies the animation type (timing or spring) and their options (such as duration for timing).
   */
  transitionSpec: {
    /**
     * Transition configuration when adding a screen.
     */
    open: TransitionSpec;
    /**
     * Transition configuration when removing a screen.
     */
    close: TransitionSpec;
  };
  /**
   * Function which specifies interpolated styles for various parts of the card, e.g. the overlay, shadow etc.
   */
  cardStyleInterpolator: StackCardStyleInterpolator;
  /**
   * Function which specifies interpolated styles for various parts of the header, e.g. the title, left button etc.
   */
  headerStyleInterpolator: StackHeaderStyleInterpolator;
};
