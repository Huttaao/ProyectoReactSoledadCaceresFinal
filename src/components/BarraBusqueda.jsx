import { FaSearch } from 'react-icons/fa';
import { SearchBarContainer, SearchInput, SearchIcon } from '../styles/StyledComponents';

const BarraBusqueda = ({ busqueda, setBusqueda }) => {
  return (
    <SearchBarContainer>
      <SearchInput
        type="text"
        placeholder="Buscar productos por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
    </SearchBarContainer>
  );
};

export default BarraBusqueda;
