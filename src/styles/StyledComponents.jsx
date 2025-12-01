import styled from 'styled-components';

// Colores del tema
export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
};

// Card de producto estilizada con mejor UX mobile-first
export const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  /* Touch-friendly en móvil */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  }
  
  /* En móvil, mejor feedback táctil */
  &:active {
    transform: scale(0.98);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  /* Mobile first: altura más pequeña */
  height: 200px;
  object-fit: contain;
  padding: 1rem;
  background: #f8f9fa;
  transition: transform 0.3s ease;

  /* Tablet y desktop: más altura */
  @media (min-width: 768px) {
    height: 250px;
  }

  @media (hover: hover) {
    ${ProductCard}:hover & {
      transform: scale(1.05);
    }
  }
`;

export const ProductInfo = styled.div`
  /* Mobile first: padding más pequeño */
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  /* Desktop: más padding */
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ProductTitle = styled.h5`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${colors.dark};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductPrice = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
  margin: 0.5rem 0;
`;

export const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const badgeBackgroundByVariant = {
  primary: colors.primary,
  success: colors.success,
  danger: colors.danger,
  warning: colors.warning,
  info: colors.info,
};

// Botones estilizados con mejor UX mobile-first
export const StyledButton = styled.button`
  /* Mobile first: botones táctiles más grandes */
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  min-height: 44px; /* Recomendación de Apple para touch targets */
  text-align: center;

  /* Desktop: tamaño normal */
  @media (min-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: scale(1.05);
    }
  }

  /* Feedback táctil en móvil */
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

export const PrimaryButton = styled(StyledButton)`
  background: ${colors.primary};
  color: white;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #0056b3;
    }
  }
`;

export const SuccessButton = styled(StyledButton)`
  background: ${colors.success};
  color: white;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #218838;
    }
  }
`;

export const DangerButton = styled(StyledButton)`
  background: ${colors.danger};
  color: white;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #c82333;
    }
  }
`;

export const WarningButton = styled(StyledButton)`
  background: ${colors.warning};
  color: ${colors.dark};

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #e0a800;
    }
  }
`;

export const SecondaryButton = styled(StyledButton)`
  background: ${colors.secondary};
  color: white;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #5a6268;
    }
  }
`;

export const OutlineButton = styled(StyledButton)`
  background: transparent;
  color: ${props => props.color || colors.primary};
  border: 2px solid ${props => props.color || colors.primary};

  &:hover:not(:disabled) {
    background: ${props => props.color || colors.primary};
    color: white;
  }
`;

// Contenedores
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.dark};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: 1.5rem;
  border-bottom: 3px solid ${colors.primary};
  padding-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Input estilizado mobile-first
export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? colors.danger : '#ced4da'};
  border-radius: 8px;
  /* Evitar zoom en iOS */
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? colors.danger : colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => props.error ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)'};
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? colors.danger : '#ced4da'};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? colors.danger : colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => props.error ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)'};
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? colors.danger : '#ced4da'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? colors.danger : colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => props.error ? 'rgba(220, 53, 69, 0.25)' : 'rgba(0, 123, 255, 0.25)'};
  }
`;

// Error message
export const ErrorMessage = styled.span`
  color: ${colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

// Badge
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 50px;
  background: ${({ $variant = 'primary' }) => badgeBackgroundByVariant[$variant] || colors.primary};
  color: ${({ $variant = 'primary' }) => ($variant === 'warning' ? colors.dark : colors.white)};
`;

// Card genérica mobile-first
export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* Mobile: menos padding */
  padding: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

// Spinner de carga
export const Spinner = styled.div.attrs(props => ({
  // Evitar pasar props no-DOM al elemento HTML
  center: undefined
}))`
  border: 4px solid ${colors.light};
  border-top: 4px solid ${colors.primary};
  border-radius: 50%;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  animation: spin 1s linear infinite;
  margin: ${props => props.center ? '2rem auto' : '0'};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Grid responsive con enfoque mobile-first
export const Grid = styled.div`
  display: grid;
  /* Mobile first: 1 columna por defecto */
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;

  /* Tablet: 2 columnas */
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  /* Desktop pequeño: 3 columnas */
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  /* Desktop grande: 4 columnas */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

// Navbar estilizado
export const StyledNavbar = styled.nav`
  background: linear-gradient(135deg, ${colors.primary} 0%, #0056b3 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// Footer estilizado
export const StyledFooter = styled.footer`
  background: ${colors.dark};
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
`;

// SearchBar con mejor UX mobile-first
export const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 1.5rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  /* Mobile: más padding para mejor touch */
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid ${colors.primary};
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  /* Evitar zoom en iOS */
  font-size: 16px;

  @media (min-width: 768px) {
    padding: 0.75rem 3rem 0.75rem 1rem;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.primary};
  font-size: 1.2rem;
  pointer-events: none;
`;
