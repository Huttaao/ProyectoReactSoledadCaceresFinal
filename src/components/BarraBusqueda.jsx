import { FaSearch } from 'react-icons/fa';
import { useCallback, useRef, useState } from 'react';
import { SearchBarContainer, SearchInput, SearchIcon } from '../styles/StyledComponents';

const BarraBusqueda = ({ busqueda, setBusqueda }) => {
  const timeoutRef = useRef(null);
  const [inputValue, setInputValue] = useState(busqueda);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    // Actualizar el input inmediatamente (para que se vea responsive)
    setInputValue(value);
    
    // Pero postergar la búsqueda 300ms
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setBusqueda(value);
    }, 300);
  }, [setBusqueda]);

  return (
    <SearchBarContainer>
      <SearchInput
        type="text"
        placeholder="Buscar productos por nombre o categoría..."
        value={inputValue}
        onChange={handleChange}
      />
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
    </SearchBarContainer>
  );
};

export default BarraBusqueda;
