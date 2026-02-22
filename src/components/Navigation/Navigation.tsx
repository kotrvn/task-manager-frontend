// src/components/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { styles } from './styles';


export const Navigation: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.active : {}),
        })}
      >
        Задачи
      </NavLink>
      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          ...styles.link,
          ...(isActive ? styles.active : {}),
        })}
      >
        Дашборд
      </NavLink>
    </nav>
  );
};