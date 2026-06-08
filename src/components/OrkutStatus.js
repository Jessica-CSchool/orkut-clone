import React from 'react';
import styled from 'styled-components';

const StatusWrapper = styled.div`
  background-color: #F4F4F4;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #E5E5E5;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-family: sans-serif;

  .bolinha {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }

  select {
    background: transparent;
    border: 0;
    font-size: 12px;
    color: #5A5A5A;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    width: 100%;
  }
`;

export default function OrkutStatus() {
  const [status, setStatus] = React.useState('Disponível');

  React.useEffect(() => {
    const salvo = localStorage.getItem('orkut_status');
    if (salvo) setStatus(salvo);
  }, []);

  const cores = {
    'Disponível': '#468817',
    'Ausente': '#F5E050',
    'Ocupado': '#CC0000',
    'Invisível': '#999999'
  };

  return (
    <StatusWrapper>
      <span className="bolinha" style={{ backgroundColor: cores[status] }}></span>
      <select value={status} onChange={(e) => {
        setStatus(e.target.value);
        localStorage.setItem('orkut_status', e.target.value);
      }}>
        <option value="Disponível">Disponível</option>
        <option value="Ausente">Ausente</option>
        <option value="Ocupado">Ocupado</option>
        <option value="Invisível">Invisível</option>
      </select>
    </StatusWrapper>
  );
}