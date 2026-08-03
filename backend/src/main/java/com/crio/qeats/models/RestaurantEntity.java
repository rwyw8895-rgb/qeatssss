/*
 *
 *  * Copyright (c) Crio.Do 2019. All rights reserved
 *
 */

package com.crio.qeats.models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "restaurants")
@NoArgsConstructor
public class RestaurantEntity {

  @Id
  private String id;

  @NotNull
  private String restaurantId;

  @NotNull
  private String name;

  @NotNull
  private String city;

  @NotNull
  private String imageUrl;

  @NotNull
  private Double latitude;

  @NotNull
  private Double longitude;

  @NotNull
  private String opensAt;

  @NotNull
  private String closesAt;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "restaurant_attributes", joinColumns = @JoinColumn(name = "restaurant_id"))
  @Column(name = "attribute")
  @NotNull
  private List<String> attributes = new ArrayList<>();

}

