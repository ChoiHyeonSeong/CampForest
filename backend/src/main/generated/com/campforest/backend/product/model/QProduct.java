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

    public final NumberPath<Long> deposit = createNumber("deposit", Long.class);

    public final NumberPath<Long> hit = createNumber("hit", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> interest_hit = createNumber("interest_hit", Long.class);

    public final BooleanPath isSold = createBoolean("isSold");

    public final StringPath location = createString("location");

    public final StringPath productContent = createString("productContent");

    public final ListPath<ProductImage, QProductImage> productImages = this.<ProductImage, QProductImage>createList("productImages", ProductImage.class, QProductImage.class, PathInits.DIRECT2);

    public final StringPath productName = createString("productName");

    public final NumberPath<Long> productPrice = createNumber("productPrice", Long.class);

    public final EnumPath<ProductType> productType = createEnum("productType", ProductType.class);

    public final ListPath<com.campforest.backend.transaction.model.Rent, com.campforest.backend.transaction.model.QRent> rents = this.<com.campforest.backend.transaction.model.Rent, com.campforest.backend.transaction.model.QRent>createList("rents", com.campforest.backend.transaction.model.Rent.class, com.campforest.backend.transaction.model.QRent.class, PathInits.DIRECT2);

    public final ListPath<com.campforest.backend.transaction.model.Sale, com.campforest.backend.transaction.model.QSale> sale = this.<com.campforest.backend.transaction.model.Sale, com.campforest.backend.transaction.model.QSale>createList("sale", com.campforest.backend.transaction.model.Sale.class, com.campforest.backend.transaction.model.QSale.class, PathInits.DIRECT2);

    public final ListPath<SaveProduct, QSaveProduct> savedBy = this.<SaveProduct, QSaveProduct>createList("savedBy", SaveProduct.class, QSaveProduct.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

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

