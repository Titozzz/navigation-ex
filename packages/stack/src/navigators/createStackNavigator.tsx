import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
} from '@react-navigation/core';
import {
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
  StackActions,
} from '@react-navigation/routers';
import KeyboardManager from '../views/KeyboardManager';
import StackView from '../views/Stack/StackView';
import {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<StackNavigationOptions> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  keyboardHandlingEnabled,
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState,
    StackRouterOptions,
    StackNavigationOptions,
    StackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  React.useEffect(
    () =>
      navigation.addListener &&
      navigation.addListener('tabPress', (e: EventArg<'tabPress'>) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (state.index > 0 && isFocused && !e.defaultPrevented) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  return (
    <KeyboardManager enabled={keyboardHandlingEnabled !== false}>
      {props => (
        <StackView
          state={state}
          descriptors={descriptors}
          navigation={navigation}
          {...rest}
          {...props}
        />
      )}
    </KeyboardManager>
  );
}

export default createNavigatorFactory<
  StackNavigationOptions,
  typeof StackNavigator
>(StackNavigator);
