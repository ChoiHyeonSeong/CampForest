package com.campforest.backend.product.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QProduct is a Querydsl query type for Product
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QProduct extends EntityPathBase<Product> {

    private static final long serialVersionUID = 928163374L;

    public static final QProduct product = new QProduct("product");

    public final EnumPath<Category> category = createEnum("category", Category.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> hit = createNumber("hit", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> interest_hit = createNumber("interest_hit", Long.class);

    public final StringPath location = createString("location");

    public final StringPath productContent = createString("productContent");

    public final ListPath<ProductImage, QProductImage> productImages = this.<ProductImage, QProductImage>createList("productImages", ProductImage.class, QProductImage.class, PathInits.DIRECT2);

    public final StringPath productName = createString("productName");

    public final NumberPath<Long> productPrice = createNumber("productPrice", Long.class);

    public final EnumPath<ProductType> productType = createEnum("productType", ProductType.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> user_id = createNumber("user_id", Long.class);

    public QProduct(String variable) {
        super(Product.class, forVariable(variable));
    }

    public QProduct(Path<? extends Product> path) {
        super(path.getType(), path.getMetadata());
    }

    public QProduct(PathMetadata metadata) {
        super(Product.class, metadata);
    }

}

