import { createNavigationContainerRef } from '@react-navigation/native';

// Tạo navigationRef toàn cục
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
