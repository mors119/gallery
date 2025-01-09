-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS member_insert_trigger ON member;

-- 기존 함수 삭제
DROP FUNCTION IF EXISTS insert_point_on_member_insert();

-- 주문번호 생성함수 삭제
drop function if exists generate_order_no();

-- 트리거를 실행할 함수
CREATE OR REPLACE FUNCTION insert_point_on_member_insert()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO point (member_id, name, point)
    VALUES (NEW.id, '회원가입 축하', 1000);  -- 새 회원에게 100 포인트 추가
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- member 테이블에 트리거 생성
CREATE TRIGGER member_insert_trigger
    AFTER INSERT ON member
    FOR EACH ROW
EXECUTE FUNCTION insert_point_on_member_insert();

-- 주문번호 생성
CREATE OR REPLACE FUNCTION generate_order_no() RETURNS TEXT AS $$
BEGIN
RETURN to_char(now(), 'YYYYMMDDHH24MISS') || LPAD((EXTRACT(EPOCH FROM now())::integer % 100)::text, 2, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;