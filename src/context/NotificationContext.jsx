import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null);

  /**
   * HOOK: useCallback
   * Keeps showNotification reference consistent so it can be safely added to dependency arrays
   */
  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });

    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {toast && (
        <div className={`toast-notification toast-${toast.type} animate-slide-in`}>
          <div className="toast-icon">
            {toast.type === 'success' ? '✓' : 'ℹ'}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
