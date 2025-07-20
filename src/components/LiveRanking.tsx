import { useState, useEffect } from 'react';
import type { Product } from '@/data/products';
import { getProductRanking } from '@/api/giftApi';
import * as S from '@/components/LiveRankingStyle';
import { FilterGender, FilterType } from '@/components/LiveRankingFilter';
import { useNavigate } from 'react-router-dom';

const genderList = [
  { label: 'All', icon: 'ALL' },
  { label: '남성이', icon: '👨‍🦰' },
  { label: '여성이', icon: '👩‍🦰' },
  { label: '청소년이', icon: '👦' },
];

const typeList = ['받고 싶어한', '많이 선물한', '위시로 받은'];
type GenderLabel = (typeof genderList)[number]['label'];
type TypeLabel = (typeof typeList)[number];

const genderMap: Record<GenderLabel, string> = {
  All: 'ALL',
  남성이: 'MALE',
  여성이: 'FEMALE',
  청소년이: 'TEEN',
};

const typeMap: Record<TypeLabel, string> = {
  '받고 싶어한': 'MANY_WISH',
  '많이 선물한': 'MANY_RECEIVE',
  '위시로 받은': 'MANY_WISH_RECEIVE',
};

const TrendRanking = () => {
  const [selectedGender, setSelectedGender] = useState<GenderLabel>('All');
  const [selectedType, setSelectedType] = useState<TypeLabel>('받고 싶어한');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleGenderClick = (label: string) => {
    setSelectedGender(label);
  };

  const handleTypeSelect = (label: string) => {
    setSelectedType(label);
  };

  const handleProductSelect = (product: Product) => {
    navigate(`/order/${product.id}`);
  };

  const handleToggleView = () => {
    if (isExpanded) {
      setVisibleCount(6);
      setIsExpanded(false);
    } else {
      setVisibleCount(products.length);
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getProductRanking({
          targetType: genderMap[selectedGender],
          rankType: typeMap[selectedType],
        });
        setProducts(data);
        setVisibleCount(6);
        setIsExpanded(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [selectedGender, selectedType]);

  return (
    <S.Container>
      <S.RankingTitle>실시간 급상승 선물랭킹</S.RankingTitle>

      <S.GenderTab>
        {genderList.map(({ icon, label }) => (
          <FilterGender
            key={label}
            icon={icon}
            label={label}
            isActive={selectedGender === label}
            onClick={handleGenderClick}
          />
        ))}
      </S.GenderTab>

      <S.TypeTab>
        {typeList.map((label) => (
          <FilterType
            key={label}
            label={label}
            isActive={selectedType === label}
            onClick={handleTypeSelect}
          />
        ))}
      </S.TypeTab>

      {loading ? (
        <p>로딩 중...</p>
      ) : products.length === 0 || error ? (
        <p>상품 목록이 없습니다.</p>
      ) : (
        <>
          <S.ProductTab>
            {products.slice(0, visibleCount).map((item, index) => (
              <S.ProductItem
                key={item.id}
                onClick={() => handleProductSelect(item)}
              >
                <S.Rank rank={index + 1}>{index + 1}</S.Rank>
                <S.ProductImage src={item.imageURL} alt={item.name} />
                <p>{item.brandInfo.name}</p>
                <p>{item.name}</p>
                <strong>{item.price.sellingPrice.toLocaleString()} 원</strong>
              </S.ProductItem>
            ))}
          </S.ProductTab>
          {products.length > 6 && (
            <S.MoreButton onClick={handleToggleView}>
              {isExpanded ? '접기' : '더보기'}
            </S.MoreButton>
          )}
        </>
      )}
    </S.Container>
  );
};

export default TrendRanking;
