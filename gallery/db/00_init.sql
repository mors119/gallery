-- =========================================================
-- Gallery DB Init (PostgreSQL)
--
-- Docker postgres 이미지의 /docker-entrypoint-initdb.d 에서 실행될 단일 init 스크립트.
-- (Functions -> Tables -> Triggers) 순서로 구성해서 의존성 문제를 방지합니다.
-- =========================================================

-- =========================================================
-- 0) CLEANUP (선택)
--    init 단계에서는 보통 최초 실행만 하므로 필요 없지만,
--    같은 SQL을 수동 재실행할 때를 대비해 안전한 DROP을 추가합니다.
-- =========================================================

-- 트리거는 테이블에 종속되므로, 테이블이 없으면 DROP이 실패합니다.
-- 따라서 DO 블록으로 "존재할 때만" 삭제합니다.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'member_insert_trigger'
      AND c.relname = 'member'
  ) THEN
    EXECUTE 'DROP TRIGGER member_insert_trigger ON member';
  END IF;
END $$;

DROP FUNCTION IF EXISTS insert_point_on_member_insert();
DROP FUNCTION IF EXISTS generate_order_no();

-- =========================================================
-- 1) FUNCTIONS
-- =========================================================

-- 회원 가입 시 포인트 자동 적립 트리거 함수
-- - 주의: 이 함수는 point / member 테이블이 "실행 시점"에 존재하면 됩니다.
--         (함수 생성 시점에는 테이블이 없어도 됩니다.)
CREATE OR REPLACE FUNCTION insert_point_on_member_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO point (member_id, name, point)
  VALUES (NEW.id, '회원가입 축하', 1000);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 주문번호 생성 함수
-- - now()를 사용하므로 IMMUTABLE(불변)로 선언하면 안 됩니다.
-- - STABLE/VOLATILE 중 하나를 써야 합니다. (시간에 의존하므로 VOLATILE이 가장 안전)
CREATE OR REPLACE FUNCTION generate_order_no()
RETURNS TEXT AS $$
BEGIN
  RETURN to_char(now(), 'YYYYMMDDHH24MISS')
         || LPAD((EXTRACT(EPOCH FROM now())::integer % 100)::text, 2, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

-- =========================================================
-- 2) TABLES
--    (사용자 제공 01_create.sql 기반)
-- =========================================================

create table member (
    id          varchar(50)         not null,
    pw          varchar(255)        not null,
    name        varchar(40)         not null,
    email       varchar(50)         not null,
    tel         varchar(20)         null,
    phone       varchar(20)         not null,
    birth       date                not null,
    zipcode     varchar(10)         not null,
    addr1       varchar(200)        not null,
    addr2       varchar(100)        null,
    mailyn      bpchar(1)       default 'n'::bpchar     not null,
    regdate     date            default now()           not null,
    isadmin     bpchar(1)       default 'n'::bpchar,
    constraint  member_pkey primary key (id)
);

create table point (
    no          serial4                 not null,
    name        varchar(50)             not null,
    point       int         default 0   not null,
    use_point   int         default 0,
    enddate     date,
    regdate     date        default now()   not null,
    member_id   varchar(50),
    constraint point_pkey primary key (no),
    constraint fk_point_member foreign key (member_id) references "member" (id) on delete cascade
);

create table coupon (
    no          varchar(50)     not null,
    name        varchar(50)     not null,
    venefit     varchar(100),
    startdate   date,
    enddate     date,
    regdate     date,
    member_id   varchar(50),
    constraint coupon_pkey primary key (no),
    constraint fk_coupon_member foreign key (member_id) references "member" (id) on delete cascade
);

create table qna (
    "no"    serial4            not null,
    title   varchar(200)       not null,
    answer  text               null,
    content text               null,
    regdate date default now() not null,
    id      varchar(50)        null,
    ofile   varchar(300),
    nfile   varchar(300),
    constraint qna_pkey primary key (no),
    constraint fk_qna_member foreign key (id) references "member" (id) on delete cascade
);

create table faq (
    "no"     serial4            not null,
    cate     varchar(50)        not null,
    question text               not null,
    answer   text               null,
    regdate  date default now() not null,
    constraint faq_pkey primary key (no)
);

create table notice (
    "no"      serial4            not null,
    title     varchar(200)       not null,
    "content" text               null,
    regdate   date default now() not null,
    ofile     varchar(300),
    nfile     varchar(300),
    constraint notice_pkey primary key (no)
);

create table event (
    "no"      serial4      not null,
    title     varchar(200) not null,
    poster    varchar(300) not null,
    sub       varchar(500) not null,
    "content" text         null,
    startdate date         null,
    enddate   date         null,
    regdate   date         default now() not null,
    constraint event_pkey primary key (no)
);

create table author (
    "no"    serial4            not null,
    img     varchar(300)       null,
    name_kr varchar(100)       null,
    name_en varchar(100)       null,
    loc     varchar(50)        null,
    born    varchar(20)        null,
    death   varchar(20)        null,
    pop     varchar(500)       null,
    descr   text               null,
    regdate date               default now() not null,
    constraint author_pkey primary key (no)
);

create table goods (
    "no"      serial4      not null,
    title     varchar(200) not null,
    price     numeric      not null,
    poster    varchar(300) not null,
    genre     varchar(100) null,
    subject   varchar(100) null,
    "type"    varchar(20)  null,
    qty       int4         not null,
    author_no int4         null,
    constraint goods_pkey primary key (no),
    constraint fk_goods_author foreign key (author_no) references author ("no") on delete cascade
);

create table wish (
    goods_no     int4,
    member_id    varchar(50),
    constraint wish_pkey primary key (goods_no, member_id),
    constraint fk_wish_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_wish_member_id foreign key (member_id) references member (id) on delete cascade
);

create table review (
    "no"      serial4      not null,
    rating    int4         default 5 not null,
    title     varchar(100) not null,
    content   text         null,
    member_id varchar(50)  not null,
    regdate   date         default now() not null,
    goods_no  int4         not null,
    constraint review_pkey primary key (no),
    constraint fk_review_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_review_member_id foreign key (member_id) references member (id) on delete cascade
);

create table ask (
    "no"      serial4      not null,
    question  varchar(100) not null,
    answer    text         null,
    member_id varchar(50)  not null,
    regdate   date         default now() not null,
    goods_no  int4         not null,
    email     varchar(50)  null,
    phone     varchar(20)  null,
    content   text         null,
    constraint ask_pkey primary key ("no"),
    constraint fk_ask_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_ask_member_id foreign key (member_id) references member (id) on delete cascade
);

create table cart (
    "no"     serial4 not null,
    amount   varchar,
    blank    varchar,
    frame    varchar,
    media    varchar,
    retouch  varchar,
    size     varchar,
    goods_no int,
    constraint cart_pkey primary key ("no"),
    constraint fk_cart_goods_no foreign key (goods_no) references goods ("no") on delete cascade
);

CREATE TABLE "order" (
    "no"      varchar   DEFAULT generate_order_no(),
    member_id  varchar NULL,
    name       varchar                 NOT NULL,
    phone      varchar                 NOT NULL,
    tel        varchar                 NOT NULL,
    zipcode    varchar                 NOT NULL,
    addr       varchar                 NOT NULL,
    addr2      varchar null,
    request    varchar null,
    price      varchar                 NOT NULL,
    cart_no    int                     NOT NULL,
    pay_name   varchar                 NOT NULL,
    states     bpchar(1)   default 'n'::bpchar,
    regdate    timestamp DEFAULT now() NOT null,
    constraint order_pkey primary key ("no"),
    constraint fk_order_cart_no foreign key (cart_no) references cart ("no") on delete cascade,
    constraint fk_order_member_id foreign key (member_id) references member (id) on delete cascade
);

-- =========================================================
-- 3) TRIGGERS
--    (테이블 생성 이후에만 가능)
-- =========================================================

CREATE TRIGGER member_insert_trigger
AFTER INSERT ON member
FOR EACH ROW
EXECUTE FUNCTION insert_point_on_member_insert();

-- =========================================================
-- 끝
-- =========================================================
