import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { colors, fontSizes, spaces } from '@/tokens/designTokens';
import { getThemes, type Theme } from '@/api/giftApi';

const Wrap = styled.section`
  padding: ${spaces.lg} ${spaces.md};
  background: ${colors.bg};
`;

const List = styled.ul`
  display: flex;
  overflow-x: auto;
  gap: ${spaces.md};
`;

const Item = styled.li`
  flex: 0 0 auto;
  text-align: center;
  color: ${colors.text};
  font-size: ${fontSizes.body};
`;

const Img = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${spaces.sm};
  object-fit: cover;
  margin-bottom: ${spaces.sm};
`;

export default function ThemeSection() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getThemes()
      .then(setThemes)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Wrap>
        <p>로딩 중...</p>
      </Wrap>
    );
  }

  if (error || themes.length === 0) return null;

  return (
    <Wrap>
      <List>
        {themes.map(theme => (
          <Item key={theme.themeId}>
            <Img src={theme.image} alt={theme.name} />
            <span>{theme.name}</span>
          </Item>
        ))}
      </List>
    </Wrap>
  );
}
