drop table if exists ask;
drop table if exists review;
drop table if exists wish;
drop table if exists "order";
drop table if exists cart;
drop table if exists goods;
drop table if exists author;
drop table if exists "event";
drop table if exists "notice";
drop table if exists faq;
drop table if exists qna;
drop table if exists coupon;
drop table if exists point;
drop table if exists "member";

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
    no          serial4	                not null,
    name        varchar(50)	            not null,
    point		int			default 0	not null,
    use_point	int 		default 0,
    enddate 	date,
    regdate		date 	    default now()   not null,
    member_id	varchar(50),
    constraint point_pkey primary key (no),
    constraint fk_point_member foreign key (member_id) references "member" (id) on delete cascade
);

create table coupon (
    no 			varchar(50)		not null,
    name 		varchar(50)		not null,
    venefit		varchar(100),
    startdate	date,
    enddate		date,
    regdate		date,
    member_id	varchar(50),
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
    goods_no 	int4,
    member_id 	varchar(50),
    constraint wish_pkey primary key (goods_no, member_id),
    constraint fk_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_member_id foreign key (member_id) references member (id) on delete cascade
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
    constraint fk_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_member_id foreign key (member_id) references member (id) on delete cascade
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
    constraint fk_goods_no foreign key (goods_no) references goods ("no") on delete cascade,
    constraint fk_member_id foreign key (member_id) references member (id) on delete cascade
);


create table cart
(
    "no"     serial4 not null,
    amount   varchar,
    blank    varchar,
    frame    varchar,
    media    varchar,
    retouch  varchar,
    size     varchar,
    goods_no int,
    constraint cart_pkey primary key ("no"),
    constraint fk_goods_no foreign key (goods_no) references goods ("no") on delete cascade
);

CREATE TABLE "order"
(
    "no"      varchar   DEFAULT generate_order_no(),
    member_id varchar NULL,
    name      varchar                 NOT NULL,
    phone     varchar                 NOT NULL,
    tel       varchar                 NOT NULL,
    zipcode   varchar                 NOT NULL,
    addr      varchar                 NOT NULL,
    addr2     varchar null,
    request   varchar null,
    price     varchar                 NOT NULL,
    cart_no   int                     NOT NULL,
    pay_name  varchar                 NOT NULL,
    states    bpchar(1)   default 'n'::bpchar,
    regdate   timestamp DEFAULT now() NOT null,
    constraint order_pkey primary key ("no"),
    constraint fk_cart_no foreign key (cart_no) references cart ("no") on delete cascade,
    constraint fk_member_id foreign key (member_id) references member (id) on delete cascade
);
